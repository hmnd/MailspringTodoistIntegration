import {
    React,
} from 'nylas-exports';

import TodoistProjectStore from './todoist-project-store';
import TodoistTaskStore from './todoist-task-store';
import ReactSelectize from 'react-selectize';

var SimpleSelect = ReactSelectize.SimpleSelect;

// http://furqanzafar.github.io/react-selectize/#/?category=simple
// Check for custom styling (color + levels) etc.


module.exports = React.createClass({

    getInitialState: function(){
        return {
            projects: TodoistProjectStore.getProjects(),
            current_project_id: null,
        }
    },

    componentDidMount: function(){
        this._unsubscribeProjectStore = TodoistProjectStore.listen(this.onProjectStoreChange);
        this._unsubscribeTaskStore = TodoistTaskStore.listen(this.onTaskStoreChange);
    },

    componentWillUnmount: function() {
        this._unsubscribeProjectStore();
        this._unsubscribeTaskStore();
    },



    render: function(){
        var self = this;
        let options = [];
        let currentProject = null;
        let inboxProject = null;
        if(this.state.projects){
            options = this.state.projects.map(function(project){
                console.log(self.state.current_project_id);
                console.log(project.id);
                if(self.state.current_project_id === project.id){
                    currentProject = {value: project.id, label: project.name, color: project.color, indent: project.indent};
                }
                if(project.inbox_project){
                    inboxProject = {value: project.id, label: project.name, color: project.color, indent: project.indent};
                }
                return {value: project.id, label: project.name, color: project.color, indent: project.indent};
            });
        }

        return (
            <div>
                <SimpleSelect
                    options={options}
                    defaultValue={currentProject ? currentProject : inboxProject}
                    onValueChange={function(item){
                        self.props.onChange(item ? item.value : null);
                    }}
                    renderOption={function(item){
                        return (
                            <div className={"simple-option n1todoist-project-listitem n1todoist-project-listitem-indent--"+item.indent}>
                                <span className={"n1todoist-project-listitem__color n1todoist-color--" + item.color}></span>
                                <span className="n1todoist-project-listitem__label">{item.label}</span>
                            </div>
                        );
                    }}
                    renderValue={function(item){
                        return (
                            <div className="simple-value n1todoist-project-listitem n1todoist-project-value">
                                <span className={"n1todoist-project-listitem__color n1todoist-color--" + item.color}></span>
                                <span className="n1todoist-project-listitem__label">{item.label}</span>
                            </div>
                        );
                    }}
                />
            </div>
        );
    },

    onProjectStoreChange: function(){
        this._setStateFromProjectStore();
    },

    onTaskStoreChange: function(){
        let currTask = TodoistTaskStore.taskForFocusedContent();
        console.log(currTask);
        let currProjectId = currTask.project_id ? currTask.project_id : null;
        this.setState({
            project_id: currProjectId
        })
    },

    _setStateFromProjectStore: function(){
        this.setState({
            projects: TodoistProjectStore.getProjects()
        });
    },





});
