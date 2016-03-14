import {
    React,
} from 'nylas-exports';

import TodoistTaskStore from './todoist-task-store';

var TodoistLabel = React.createClass({

    getInitialState: function(){
        return {
            hasTask: this._hasTask()
        }
    },

    componentDidMount: function(){
        //this._unsubscribe =
    },

    componentWillUnmount: function() {
        //this._unsubscribe();
    },

    render: function(){

        if(this.state.hasTask){
            return <div className="mail-label n1todoist-maillabel">Task</div>
        }else{
            return null
        }
    },

    _hasTask: function(){
        let taskStorage = TodoistTaskStore._getTaskStorage();
        let hasTask = false;

        for(var key in taskStorage){
            if(key === this.props.thread.clientId){
                hasTask = true;
                break;
            }
        }
        return hasTask;
    }

});

module.exports = TodoistLabel;
