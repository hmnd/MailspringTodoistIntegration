import { Utils, React, ReactDOM, FocusedContentStore } from 'nylas-exports';
import { KeyCommandsRegion } from 'nylas-component-kit';
import TodoistTaskStore from './todoist-task-store';
import Login from './login';
import Logout from './logout';
import Projects from './projects';

const todoistCredentials = {
    url: 'https://todoist.com/API/v6/sync',
    oauth: 'https://todoist.com/oauth/authorize',
    clientSecret: 'de5502a2394144bf8bada72848c7ce41',
    clientId: 'e917bc71c8ad4786a47ca230263f9208',
    scopes: ["data:read_write", "data:delete"]
}

//TODO: Add schedule

export default class TodoistSidebar extends React.Component{
    static displayName = 'TodoistSidebar';

    constructor(props){
        super(props);
        this.state = {
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            project_id: null,
            authenticated: localStorage.getItem('N1todoist_authentication') !== null ? true : false,
            done: TodoistTaskStore.getDone(),
            update: false,
            loading: false
        };
    }

    componentDidMount(){
        this._unsubscribeTaskStore = TodoistTaskStore.listen(this.onTaskStoreChange);
    }

    componentWillUnmount() {
        this._unsubscribeTaskStore();
    }


    onTaskStoreChange = () => {
        this._setStateFromTaskStore();
    }


    _setStateFromTaskStore(){
        this.setState({
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            loading: TodoistTaskStore.loading(),
            done: TodoistTaskStore.getDone()
        });
    }

    _changeCurrentProject = (project) => {
        this.old_project = this.state.project_id;
        this.setState({
            project_id: project,
            update: !this.state.task ? false : true
        });
    }

    _keyMapHandlers(action){
        const keyMapActions = {
            'add': this.onSaveClick,
            'done': this.onDoneClick,
        };
        
        return {'n1todoistintegration:add-to-project': keyMapActions[action]};
    }

    render(){
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
    }

    _renderContent(){
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
    }

    _renderFooter(){
        if(this.state.authenticated){
            return <Logout whenLoggedOut={this.handleLogout} />
        }else{
            return <span></span>
        }

    }

    onSaveClick = () => {
        var options = {
            label: this.state.label,
            project_id: this.state.project_id
        };
        TodoistTaskStore.save(options);
        this.setState({
            update: false
        });
    }

    onEditClick = () => {
        this.setState({
            update: true
        });
    }

    onUpdateCancelClick = () => {
        this.setState({
            project_id: this.old_project,
            update: false
        });
    }

    onDoneClick = () => {
        if(this.state.done){
            TodoistTaskStore.undo();
        }else{
            TodoistTaskStore.done();
        }
    }

    onDeleteClick = () => {
        TodoistTaskStore.delete();
    }

    onLabelChange = (event) => {
        this.setState({label: event.target.value});
    }

    handleLogin = () => {
        this.setState({authenticated: true});
    }

    handleLogout = () => {
        this.setState({authenticated: false});
    }

}
