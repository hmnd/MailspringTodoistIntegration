import {
    Utils,
    React,
    ReactDOM,
    FocusedContentStore
} from 'nylas-exports';

import Login from './login';
import Logout from './logout';
import Projects from './projects';
import TodoistTaskStore from './todoist-task-store';
import { KeyCommandsRegion } from 'nylas-component-kit';

var todoistCredentials = {
    url: 'https://todoist.com/API/v6/sync',
    oauth: 'https://todoist.com/oauth/authorize',
    clientSecret: 'de5502a2394144bf8bada72848c7ce41',
    clientId: 'e917bc71c8ad4786a47ca230263f9208',
    scopes: ["data:read_write", "data:delete"]
}

var loginWindow = null;

//TODO: Add schedule
//TODO: Add project selection

var TodoistSidebar = React.createClass({


    getInitialState: function(){
        return {
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            project_id: null,
            authenticated: localStorage.getItem('N1todoist_authentication') !== null ? true : false,
            done: TodoistTaskStore.getDone(),
            update: false,
            loading: false
        }
    },

    componentDidMount: function(){
        this._unsubscribeTaskStore = TodoistTaskStore.listen(this.onTaskStoreChange);
    },

    componentWillUnmount: function() {
        this._unsubscribeTaskStore();
    },


    onTaskStoreChange: function(){
        this._setStateFromTaskStore();
    },


    _setStateFromTaskStore: function(){
        this.setState({
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            loading: TodoistTaskStore.loading(),
            done: TodoistTaskStore.getDone()
        });
    },

    _changeCurrentProject: function(project){
        this.old_project = this.state.project_id;
        this.setState({
            project_id: project,
            update: !this.state.task ? false : true
        });
    },

    _keyMapHandlers(action){
        const keyMapActions = {
            'add': this.onSaveClick,
            'done': this.onDoneClick,
        };
        
        return {'n1todoistintegration:add-to-project': keyMapActions[action]};
    },

    render: function(){
        return <div className={"n1todoist-wrapper" + (this.state.loading ? " loading" : "")}>
            <div className="n1todoist-loading">
                <div className="n1todoist-loadingtext">Loading...</div>
            </div>
            <div className="n1todoist-header">
                <img src="nylas://N1TodoistIntegration/assets/todoist_logo.png" />
            </div>
            <div className="n1todoist-content">
            {this._renderContent()}
            </div>
            <div className="n1todoist-footer">
                {this._renderFooter()}
            </div>
            </div>
    },

    _renderContent: function(){
        if(!this.state.authenticated){
            return <div>
                    <div className="n1todoist-logintext"> Login with your Todoist account </div>
                    <Login whenLoggedIn={this.handleLogin} credentials={todoistCredentials}/>

                </div>
        }else if(!this.state.task){
            return <div>
                <KeyCommandsRegion globalHandlers={this._keyMapHandlers('add')}/>
                <input
                    className="n1todoist-textinput"
                    type="text"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                <Projects onChange={this._changeCurrentProject}/>
                <button className="n1todoist-save" onClick={this.onSaveClick} >Add as task</button>
                </div>
        }else if(this.state.update){
            return <div>
                <input
                    className="n1todoist-textinput"
                    type="text"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                <Projects selectedProject={this.state.task.project_id} onChange={this._changeCurrentProject}/>
                <div className="n1todoist-btnrow">
                <button className="n1todoist-updatebtn" onClick={this.onSaveClick} >Save</button>
                <button className="n1todoist-cancelbtn" onClick={this.onUpdateCancelClick} >Cancel</button>
                </div>
                </div>
        }else{
            return <div>
                <KeyCommandsRegion globalHandlers={this._keyMapHandlers('done')}/>
                <div onClick={this.onEditClick} >
                <input
                    className="n1todoist-textinput"
                    type="text"
                    disabled="true"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                </div>
                <Projects selectedProject={this.state.task.project_id} onChange={this._changeCurrentProject}/>

                <div className="n1todoist-btnrow">
                <button className="n1todoist-iconbtn n1todoist-iconbtn--done" onClick={this.onDoneClick} >{this.state.done ? "Undo" : "Done"}</button>
                <button className="n1todoist-iconbtn n1todoist-iconbtn--delete" onClick={this.onDeleteClick} >Delete</button>
                </div>
                </div>
        }
    },

    _renderFooter: function(){
        if(this.state.authenticated){
            return <Logout whenLoggedOut={this.handleLogout} />
        }else{
            return <span></span>
        }

    },

    onSaveClick: function(){
        var options = {
            label: this.state.label,
            project_id: this.state.project_id
        };
        console.log(options);
        TodoistTaskStore.save(options);
        this.setState({
            update: false
        });
    },

    onEditClick: function(){
        this.setState({
            update: true
        });
    },

    onUpdateCancelClick: function(){
        this.setState({
            project_id: this.old_project,
            update: false
        });
    },

    onDoneClick: function(){
        if(this.state.done){
            TodoistTaskStore.undo();
        }else{
            TodoistTaskStore.done();
        }
    },

    onDeleteClick: function(){
        TodoistTaskStore.delete();
    },

    onLabelChange: function(event){
        this.setState({label: event.target.value});
    },

    handleLogin: function(){
        this.setState({authenticated: true});
    },

    handleLogout: function(){
        this.setState({authenticated: false});
    }



});

module.exports = TodoistSidebar;
