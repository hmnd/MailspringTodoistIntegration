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
    console.log("fetch projects");
    if(!this._projects){
      this._todoistFetchProjects();
    }
  }

  _todoistFetchProjects() {
    let accessToken = localStorage.getItem("N1todoist_authentication")
    let seqNo = 0
    let resourceTypes = ['projects']
    let payload = { token: accessToken, seq_no: seqNo, resource_types: JSON.stringify(resourceTypes)}

    if (accessToken) {
      request
      .post('https://todoist.com/API/v6/sync')
      .send(payload)
      .set("Content-Type","application/x-www-form-urlencoded")
      .end(this._handleTodoistFetchProjectsResponse.bind(this))
    }

  }

  _handleTodoistFetchProjectsResponse(error, response) {
    if(response && response.ok){
      this._setProjects(response.body.Projects);
    }else{
      console.log(error);
    }
  }

  _setProjects(projects){
    projects.sort(this._sortProjects);
    this._projects = projects;

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
