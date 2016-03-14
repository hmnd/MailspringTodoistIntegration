import {
    Utils,
    React,
    FocusedContentStore
} from 'nylas-exports';

import Login from './login';
import Logout from './logout';
import TodoistTaskStore from './todoist-task-store';

var todoistCredentials = {
    url: 'https://todoist.com/API/v6/sync',
    oauth: 'https://todoist.com/oauth/authorize',
    clientSecret: 'de5502a2394144bf8bada72848c7ce41',
    clientId: 'e917bc71c8ad4786a47ca230263f9208',
    scopes: ["data:read_write", "data:delete"]
}

var loginWindow = null;

//TODO: Add Label for mail
//TODO: Add reminder
//TODO: Add project selection
//TODO: Add labeling
module.exports = React.createClass({


    getInitialState: function(){
        return {
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            authenticated: localStorage.getItem('N1todoist_authentication') !== null ? true : false,
            loading: true
        }
    },

    componentDidMount: function(){
        this._unsubscribe = TodoistTaskStore.listen(this.onTaskStoreChange);
    },

    componentWillUnmount: function() {
        this._unsubscribe();
    },


    onTaskStoreChange: function(){
        this._setStateFromStore();
    },

    _setStateFromStore: function(){
        this.setState({
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            loading: TodoistTaskStore.loading()
        });
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
                <input
                    className="n1todoist-textinput"
                    type="text"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                <button className="n1todoist-save" onClick={this.onSaveClick} >Add as task</button>
                </div>
        }else{
            return <div>
                <input
                    className="n1todoist-textinput"
                    type="text"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                <button className="n1todoist-save" onClick={this.onSaveClick} >Update task</button>
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
            label: this.state.label
        };

        TodoistTaskStore.save(options);
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
