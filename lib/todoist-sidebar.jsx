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


module.exports = React.createClass({


    getInitialState: function(){
        return {
            task: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().id : null,
            label: TodoistTaskStore.taskForFocusedContent() ? TodoistTaskStore.taskForFocusedContent().content : FocusedContentStore.focused('thread').subject,
            authenticated: localStorage.getItem('N1todoist_authentication') !== null ? true : false
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
        });
    },

    render: function(){
        if(!this.state.authenticated){
            return <Login whenLoggedIn={this.handleLogin} credentials={todoistCredentials}/>
        }else if(!this.state.task){
            return <div>
                <input
                    type="text"
                    value={this.state.label}
                    onChange={this.onLabelChange} />
                <button onClick={this.onSaveClick} >Save</button>
                <Logout whenLoggedOut={this.handleLogout} /></div>
        }else{
            return <div>
                <input
                type="text"
                value={this.state.label}
                onChange={this.onLabelChange} />
            <button onClick={this.onSaveClick} >Update</button>
            <Logout whenLoggedOut={this.handleLogout} /></div>
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
