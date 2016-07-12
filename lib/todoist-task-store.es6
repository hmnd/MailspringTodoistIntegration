import request from 'superagent';
import NylasStore from 'nylas-store';
import {FocusedContentStore} from 'nylas-exports';

class TodoistTaskStore extends NylasStore {
  constructor() {
    super();

    this._task = null;
    this._taskId = null;
    this._loading = false;
    this._error = null;
    this._tasks = null;

    this.listenTo(FocusedContentStore, this._onFocusedContentChanged);
  }

  // Getter Methods

  getTaskByClientId(clientId){
    let tasks = this.getTaskStorage()
    if(tasks){
      return tasks[clientId];
    }else{
      return null;
    }
  }

  taskForFocusedContent() {
    return this._task;
  }

  getDone(){
    return this._task ? this._task.done : false;
  }

  loading() {
    return this._loading;
  }

  error() {
    return this._error;
  }

  save(taskOptions){
    this._loading = true;
    this.trigger(this);
    if(!this._clientHasTask()){
      this._add(taskOptions);
    }else{
      this._update(taskOptions);
    }
  }

  done(){
    this._loading = true;
    this.trigger(this);
    this._done();
  }

  undo(){
    this._loading = true;
    this.trigger(this);
    this._undo();
  }

  delete(){
    this._loading = true;
    this.trigger(this);
    this._delete();
  }

  _setTask(){
    let thread = this._getThread();
    this._task = this.getTaskByClientId(thread.clientId);
    this._loading = false;
    this.trigger(this);
  }

  _setTasks(tasks){

    this._tasks = tasks;
    let storageTasks = this.getTaskStorage();
    for(var taskKey in tasks){
      for(var clientKey in storageTasks){
        if(tasks[taskKey].id === storageTasks[clientKey].id){
          storageTasks[clientKey].project_id = tasks[taskKey].project_id;
          storageTasks[clientKey].content = tasks[taskKey].content;
          storageTasks[clientKey].done = tasks[taskKey].checked === 1 ? true : false;
        }
      }
    }

    localStorage.setItem("N1todoist_tasks", JSON.stringify(storageTasks));
    this._setTask();


  }

  _randomize(){
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  _guidCreate(){
    return this._randomize() + this._randomize() + this._randomize() + '-' + this._randomize() + '-' + this._randomize() + '-' + this._randomize() + this._randomize() + this._randomize();
  }

  _add(taskOptions){
    let uuidVal = this._guidCreate();
    this.temp_id = this._guidCreate();
    this._taskcontent = taskOptions.label;
    this._project_id = taskOptions.project_id;
    let accessToken = localStorage.getItem("N1todoist_authentication");

    command = [{ type: "item_add", uuid: uuidVal, temp_id: this.temp_id, args: { content: this._taskcontent, project_id: this._project_id}}]
    payload = { token: accessToken, commands: JSON.stringify(command) }

    if(accessToken){
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleAddTaskResponse.bind(this));

      this.trigger(this);

    }
  }

  _update(taskOptions){
    let uuidVal = this._guidCreate();
    this._task.content = taskOptions.label;
    this._project_id = taskOptions.project_id;

    let accessToken = localStorage.getItem("N1todoist_authentication");
    command = [{ type: "item_update", uuid: uuidVal, args: { id: this._taskId, content: this._taskcontent, project_id: this._project_id}}]
    payload = { token: accessToken, commands: JSON.stringify(command) }

    if(accessToken){
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleUpdateTaskResponse.bind(this));

      this.trigger(this);

    }
  }

  _done(){
    let uuidVal = this._guidCreate();
    let accessToken = localStorage.getItem("N1todoist_authentication");
    command = [{ type: "item_close", uuid: uuidVal, args: { id: this._taskId}}]
    payload = { token: accessToken, commands: JSON.stringify(command) }

    if(accessToken){
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleDoneTaskResponse.bind(this));
      this.trigger(this);
    }
  }

  _undo(){
    let uuidVal = this._guidCreate();
    let accessToken = localStorage.getItem("N1todoist_authentication");
    command = [{ type: "item_uncomplete", uuid: uuidVal, args: { id: [this._taskId]}}]
    payload = { token: accessToken, commands: JSON.stringify(command) }

    if(accessToken){
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleUndoTaskResponse.bind(this));
      this.trigger(this);
    }
  }

  _delete(){
    let uuidVal = this._guidCreate();
    let accessToken = localStorage.getItem("N1todoist_authentication");
    command = [{ type: "item_delete", uuid: uuidVal, args: { id: [this._taskId]}}]
    payload = { token: accessToken, commands: JSON.stringify(command) }

    if(accessToken){
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleDeleteTaskResponse.bind(this));
      this.trigger(this);
    }
  }



  // Called when the FocusedContactStore `triggers`, notifying us that the data
  // it vends has changed.
  _onFocusedContentChanged () {
    this._loading = true;
    this.trigger(this);
    const thread = this._getThread();
    let tasks = this.getTaskStorage();
    if(!this._tasks){
      this._todoistFetchTasks();
    }


    this._task = null;
    this._error = null;

    if (thread && tasks) {
      this._taskId = tasks[thread.clientId] ? tasks[thread.clientId].id : null;

      if (this._taskId !== null) {
        this._setTask();
      }
    }else{
      this._loading = false;
      this.trigger(this);
    }
  }

  _todoistFetchTasks() {
    let accessToken = localStorage.getItem("N1todoist_authentication")
    let seqNo = 0
    let resourceTypes = ['items']
    let payload = { token: accessToken, seq_no: seqNo, resource_types: JSON.stringify(resourceTypes), args: {id: this._task} }

    if (accessToken) {
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleTodoistFetchTasksResponse.bind(this))
    }

  }

  _handleTodoistFetchTasksResponse(error, response) {
    if(response && response.ok){
      this._setTasks(response.body.Items);
    }else{
      console.log(error);
    }
  }

  _handleAddTaskResponse(error, response) {
    if(response && response.ok){
      let taskId = response.body.TempIdMapping[this.temp_id];
      var tasks = this.getTaskStorage();
      const thread = this._getThread();
      if(!tasks){
        tasks = {};
      }
      tasks[thread.clientId] = {
        id: taskId,
        project_id: this._project_id,
        content: this._taskcontent,
        done: false
      };
      this._taskId = taskId;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
    }else{
      console.log(error);
    }
  }

  _handleUpdateTaskResponse(error, response) {
    if(response && response.ok){
      this._loading = false;
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _handleDoneTaskResponse(error, response) {
    if(response && response.ok){
      let tasks = this.getTaskStorage();
      const thread = this._getThread();
      tasks[thread.clientId].done = true;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _handleUndoTaskResponse(error, response) {
    if(response && response.ok){
      let tasks = this.getTaskStorage();
      const thread = this._getThread();
      tasks[thread.clientId].done = false;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _handleDeleteTaskResponse(error, response) {
    if(response && response.ok){
      let tasks = this.getTaskStorage();
      const thread = this._getThread();
      delete tasks[thread.clientId];
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._task = null;
      this._loading = false;
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _getThread(){
    return FocusedContentStore.focused('thread');
  }

  getTaskStorage(){
    return JSON.parse(localStorage.getItem('N1todoist_tasks'));
  }

  _clientHasTask (){
    const thread = this._getThread();
    let tasks = this.getTaskStorage();
    return tasks && tasks[thread.clientId] ? true : false;

  }



}

export default new TodoistTaskStore();
