import request from 'superagent';
import NylasStore from 'nylas-store';
import { FocusedContentStore } from 'nylas-exports';

class TodoistTaskStore extends NylasStore {
  constructor() {
    super();

    this._task = null;
    this._taskId = null;
    this._loading = false;
    this._error = null;
    this._tasks = null;

    setInterval(() => {
      this._todoistFetchTasks();
    }, 5000);

    this.listenTo(FocusedContentStore, this._onFocusedContentChanged);
  }

  // Getter Methods

  getTaskByClientId(clientId) {
    const tasks = this.getTaskStorage()
    if (tasks && typeof tasks[clientId] !== "undefined") {
      return tasks[clientId];
    } else {
      return null;
    }
  }

  taskForFocusedContent() {
    return this._task;
  }

  getDone() {
    return this._task ? this._task.done : false;
  }

  loading() {
    return this._loading;
  }

  error() {
    return this._error;
  }

  save(taskOptions) {
    this._loading = true;
    this.trigger(this);
    if (!this._clientHasTask()) {
      this._add(taskOptions);
    } else {
      this._update(taskOptions);
    }
  }

  done() {
    this._loading = true;
    this.trigger(this);
    this._done();
  }

  undo() {
    this._loading = true;
    this.trigger(this);
    this._undo();
  }

  delete() {
    this._loading = true;
    this.trigger(this);
    this._delete();
  }

  _setTask() {
    const thread = this._getThread();
    if (typeof thread !== "undefined") {
      this._task = this.getTaskByClientId(thread.clientId);
      this._loading = false;
      this.trigger(this);
    }
  }

  _setTasks(tasks) {
    const storageTasks = this.getTaskStorage();
    for (var taskKey in tasks) {
      for (var clientKey in storageTasks) {
        if (tasks[taskKey].id === storageTasks[clientKey].id) {
          storageTasks[clientKey].project_id = tasks[taskKey].project_id;
          storageTasks[clientKey].content = tasks[taskKey].content;
          storageTasks[clientKey].done = tasks[taskKey].checked === 1 ? true : false;
          if (tasks[taskKey].is_deleted === 1) {
            delete storageTasks[clientKey];
          }

        }
      }
    }

    this.trigger(this);
    localStorage.setItem("N1todoist_tasks", JSON.stringify(storageTasks));
    this._setTask();
  }

  _setSynchToken(token) {
    localStorage.setItem("N1todoist_item_synchToken", token);
  }

  _getSynchToken() {
    const token = localStorage.getItem("N1todoist_item_synchToken");
    return token !== null ? token : '*';
  }

  _randomize() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  _guidCreate() {
    return this._randomize() + this._randomize() + this._randomize() + '-' + this._randomize() + '-' + this._randomize() + '-' + this._randomize() + this._randomize() + this._randomize();
  }

  _add(taskOptions) {
    const uuidVal = this._guidCreate();
    this.temp_id = this._guidCreate();
    this._taskcontent = taskOptions.label;
    this._project_id = taskOptions.project_id;
    const accessToken = localStorage.getItem("N1todoist_authentication");
    const command = [{ type: "item_add", uuid: uuidVal, temp_id: this.temp_id, args: { content: this._taskcontent, project_id: this._project_id } }]
    const payload = { token: accessToken, commands: JSON.stringify(command) }

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleAddTaskResponse.bind(this));

      this.trigger(this);

    }
  }

  _update(taskOptions) {
    const uuidVal = this._guidCreate();
    this._taskContent = taskOptions.label;
    this._taskProjectId = taskOptions.project_id;
    const accessToken = localStorage.getItem("N1todoist_authentication");

    const projectItems = {};
    projectItems[this._task.project_id] = [this._taskId];
    const command = [
      { type: "item_update", uuid: uuidVal, args: { id: this._taskId, content: this.taskContent, project_id: this._taskProjectId } },
      { type: "item_move", uuid: uuidVal, args: { project_items: projectItems, to_project: this._taskProjectId } }
    ];

    const payload = { token: accessToken, commands: JSON.stringify(command) };

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleUpdateTaskResponse.bind(this));

      this.trigger(this);
    }
  }

  _done() {
    const uuidVal = this._guidCreate();
    const accessToken = localStorage.getItem("N1todoist_authentication");
    const command = [{ type: "item_close", uuid: uuidVal, args: { id: this._taskId } }]
    const payload = { token: accessToken, commands: JSON.stringify(command) }

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleDoneTaskResponse.bind(this));
      this.trigger(this);
    }
  }

  _undo() {
    const uuidVal = this._guidCreate();
    const accessToken = localStorage.getItem("N1todoist_authentication");
    const command = [{ type: "item_uncomplete", uuid: uuidVal, args: { ids: [this._taskId] } }]
    const payload = { token: accessToken, commands: JSON.stringify(command) }

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleUndoTaskResponse.bind(this));
      this.trigger(this);
    }
  }

  _delete() {
    const uuidVal = this._guidCreate();
    const accessToken = localStorage.getItem("N1todoist_authentication");
    const command = [{ type: "item_delete", uuid: uuidVal, args: { ids: [this._taskId] } }]
    const payload = { token: accessToken, commands: JSON.stringify(command) }

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleDeleteTaskResponse.bind(this));
      this.trigger(this);
    }
  }



  // Called when the FocusedContactStore `triggers`, notifying us that the data
  // it vends has changed.
  _onFocusedContentChanged() {
    this._loading = true;
    this.trigger(this);
    const thread = this._getThread();
    const tasks = this.getTaskStorage();
    this._todoistFetchTasks();

    this._task = null;
    this._error = null;

    if (thread && tasks) {
      this._taskId = tasks[thread.clientId] ? tasks[thread.clientId].id : null;

      if (this._taskId !== null) {
        this._setTask();
      }
    } else {
      this._loading = false;
      this.trigger(this);
    }
  }

  _todoistFetchTasks() {
    const accessToken = localStorage.getItem("N1todoist_authentication")
    const syncToken = this._getSynchToken();
    const resourceTypes = ['items']
    const payload = { token: accessToken, sync_token: syncToken, resource_types: JSON.stringify(resourceTypes), args: {} }

    if (accessToken) {
      request
        .post('https://todoist.com/API/v7/sync')
        .send(payload)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .end(this._handleTodoistFetchTasksResponse.bind(this))
    }
  }

  _handleTodoistFetchTasksResponse(error, response) {
    if (response && response.ok) {
      this._setSynchToken(response.body.sync_token)
      this._setTasks(response.body.items);
    } else {
      console.log(error);
    }
  }

  _handleAddTaskResponse(error, response) {
    if (response && response.ok) {
      const taskId = response.body.temp_id_mapping[this.temp_id];
      let tasks = this.getTaskStorage();
      const thread = this._getThread();
      if (!tasks) {
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
    } else {
      console.log(error);
    }
  }

  _handleUpdateTaskResponse(error, response) {
    if (response && response.ok) {
      this._task.project_id = this._taskProjectId;
      this._loading = false;
      this.trigger(this);
    } else {
      console.log(error);
    }
  }

  _handleDoneTaskResponse(error, response) {
    if (response && response.ok) {
      const tasks = this.getTaskStorage();
      const thread = this._getThread();
      tasks[thread.clientId].done = true;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
      this.trigger(this);
    } else {
      console.log(error);
    }
  }

  _handleUndoTaskResponse(error, response) {
    if (response && response.ok) {
      const tasks = this.getTaskStorage();
      const thread = this._getThread();
      tasks[thread.clientId].done = false;
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._setTask();
      this.trigger(this);
    } else {
      console.log(error);
    }
  }

  _handleDeleteTaskResponse(error, response) {
    if (response && response.ok) {
      const tasks = this.getTaskStorage();
      const thread = this._getThread();
      delete tasks[thread.clientId];
      localStorage.setItem("N1todoist_tasks", JSON.stringify(tasks));
      this._task = null;
      this._loading = false;
      this.trigger(this);
    } else {
      console.log(error);
    }
  }

  _getThread() {
    return FocusedContentStore.focused('thread');
  }

  getTaskStorage() {
    return JSON.parse(localStorage.getItem('N1todoist_tasks'));
  }

  _clientHasTask() {
    const thread = this._getThread();
    const tasks = this.getTaskStorage();
    return tasks && tasks[thread.clientId] ? true : false;
  }

}

export default new TodoistTaskStore();
