import request from 'superagent';
import NylasStore from 'nylas-store';
import {FocusedContentStore} from 'nylas-exports';

class TodoistProjectStore extends NylasStore {
  constructor() {
    super();

    this._projects = null;
    this._loading = false;

    this.listenTo(FocusedContentStore, this._onFocusedContentChanged);
  }


  _onFocusedContentChanged(){

    this._todoistFetchProjects();

  }

  _setSynchToken(token){
    localStorage.setItem("N1todoist_project_synchToken", token);
  }

  _getSynchToken(){
    var token = localStorage.getItem("N1todoist_project_synchToken");

    return token !== null ? token : '*';
  }

  _todoistFetchProjects() {
    let accessToken = localStorage.getItem("N1todoist_authentication")
    let synchToken = this._getSynchToken();
    // TODO: implement incremental synch
    synchToken = '*';
    let resourceTypes = ['projects'];
    let payload = { token: accessToken, sync_token: synchToken, resource_types: JSON.stringify(resourceTypes)}

    if (accessToken) {
      request
      .post('https://todoist.com/API/v7/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleTodoistFetchProjectsResponse.bind(this))
    }

  }

  _handleTodoistFetchProjectsResponse(error, response) {
    if(response && response.ok){
      this._setSynchToken(response.body.sync_token);
      this._setProjects(response.body.projects);
    }else{
      console.log(error);
    }
  }

  _setProjects(projects){
    projects.sort(this._sortProjects);
    this._projects = projects;

    // this._tasks = tasks;
    // let storageTasks = this.getTaskStorage();
    // for(var taskKey in tasks){
    //   for(var clientKey in storageTasks){
    //     if(tasks[taskKey].id === storageTasks[clientKey].id){
    //
    //       // storageTasks[clientKey].project_id = tasks[taskKey].project_id;
    //       storageTasks[clientKey].content = tasks[taskKey].content;
    //       storageTasks[clientKey].done = tasks[taskKey].checked === 1 ? true : false;
    //       if(tasks[taskKey].is_deleted === 1){
    //         delete storageTasks[clientKey];
    //       }
    //
    //     }
    //   }
    // }

    this.trigger(this);
  }

  getProjects(){
    return this._projects;
  }

  _sortProjects(a,b){
    if(a.item_order < b.item_order){
      return -1;
    }else if(a.item_order > b.item_order){
      return 1;
    }else{
      return 0;
    }
  }

}

export default new TodoistProjectStore();
