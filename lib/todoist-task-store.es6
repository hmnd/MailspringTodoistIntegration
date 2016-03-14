import request from 'superagent';
import NylasStore from 'nylas-store';
import {FocusedContentStore} from 'nylas-exports';




class TodoistTaskStore extends NylasStore {
  constructor() {
    super();

    this._task = null;
    this._taskId = null;
    this._tempId;
    this._loading = false;
    this._error = null;
    this._tasks = null;

    this.listenTo(FocusedContentStore, this._onFocusedContentChanged);
  }

  // Getter Methods

  taskForFocusedContent() {
    return this._task;
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

  _setTask(forceReload = false){

    if(forceReload === false){
      for(var key in this._tasks){
        if(this._tasks[key].id === this._taskId){
          this._task = this._tasks[key];
          this.trigger(this);
          break;
        }
      }
    }


    if(!this._task || forceReload === true){
      this._todoistFetchTasks();
    }else{
      this._loading = false;
      this.trigger(this);

    }




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
    let taskName = taskOptions.label;
    let accessToken = localStorage.getItem("N1todoist_authentication");

    command = [{ type: "item_add", uuid: uuidVal, temp_id: this.temp_id, args: { content: taskName}}]
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
    let taskName = this._task.content = taskOptions.label;
    let accessToken = localStorage.getItem("N1todoist_authentication");
    command = [{ type: "item_update", uuid: uuidVal, args: { id: this._taskId ,content: taskName}}]
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



  // Called when the FocusedContactStore `triggers`, notifying us that the data
  // it vends has changed.
  _onFocusedContentChanged () {
    this._loading = true;
    this.trigger(this);
    const thread = this._getThread();
    let tasks = this._getTaskStorage();


    this._task = null;
    this._error = null;

    if (thread && tasks) {
      this._taskId = tasks[thread.clientId];
      if (this._taskId !== undefined) {
         this._setTask();
      }
    }

    this.trigger(this);
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
    this._loading = false;
    if(response && response.ok){
      this._tasks = response.body.Items;
      this._setTask();
    }else{
      console.log(error);
    }
  }

  _handleAddTaskResponse(error, response) {
    if(response && response.ok){
      let taskId = response.body.TempIdMapping[this.temp_id];
      var tasks = this._getTaskStorage();
      const thread = this._getThread();
      if(!tasks){
        tasks = {};
      }
      tasks[thread.clientId] = taskId;
      this._taskId = taskId;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _handleUpdateTaskResponse(error, response) {
    if(response && response.ok){
      this._setTask(true);
      this.trigger(this);
    }else{
      console.log(error);
    }
  }

  _getThread(){
    return FocusedContentStore.focused('thread');
  }

  _getTaskStorage(){
    return JSON.parse(localStorage.getItem('N1todoist_tasks'));
  }

  _clientHasTask (){
    const thread = this._getThread();
    let tasks = this._getTaskStorage();
    return tasks && tasks[thread.clientId] ? true : false;

  }



}

export default new TodoistTaskStore();
