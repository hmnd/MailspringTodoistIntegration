import {
    React,
} from 'nylas-exports';

import TodoistTaskStore from './todoist-task-store';

var TodoistLabel = React.createClass({

    getInitialState: function(){
        return {
            hasTask: this._hasTask(),
            done: this._isDone()
        }
    },

    componentDidMount: function(){
        this._unsubscribe = TodoistTaskStore.listen(this.onTaskStoreChange);
    },

    componentWillUnmount: function() {
        this._unsubscribe();
    },


    onTaskStoreChange: function(){
        this.setState({
            hasTask: this._hasTask(),
            done: this._isDone()
        })
    },

    render: function(){

        if(this.state.hasTask){
            return <div className={"mail-label n1todoist-maillabel" + (this.state.done ? " done" : "")}>Task</div>
        }else{
            return null
        }
    },

    _hasTask: function(){
        let task = TodoistTaskStore.getTaskByClientId(this.props.thread.clientId)

        return task ? true : false;
    },

    _isDone: function(){
        let task = TodoistTaskStore.getTaskByClientId(this.props.thread.clientId)

        return task ? task.done : false;
    }

});

module.exports = TodoistLabel;
