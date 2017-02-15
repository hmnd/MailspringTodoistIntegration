import { React } from 'nylas-exports';
// http://furqanzafar.github.io/react-selectize/#/?category=simple
// Check for custom styling (color + levels) etc.
import { SimpleSelect } from '../modules/react-selectize';

import TodoistProjectStore from './todoist-project-store';
import TodoistTaskStore from './todoist-task-store';

export default class Projects extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            projects: TodoistProjectStore.getProjects(),
            current_project_id: null,
            selectedOption: null
        };
    }

    componentDidMount(){
        this._unsubscribeProjectStore = TodoistProjectStore.listen(this.onProjectStoreChange);
        this._unsubscribeTaskStore = TodoistTaskStore.listen(this.onTaskStoreChange);
    }

    componentWillUnmount() {
        this._unsubscribeProjectStore();
        this._unsubscribeTaskStore();
    }

    render(){
        let options = [];
        let currentProject = null;
        let inboxProject = null;
        if(this.state.projects){
            options = this.state.projects.map(project => {
                if(this.state.current_project_id === project.id){
                    currentProject = {value: project.id, label: project.name, color: project.color, indent: project.indent};
                }
                if(this.inbox_project){
                    inboxProject = {value: project.id, label: project.name, color: project.color, indent: project.indent};
                }
                return {value: project.id, label: project.name, color: project.color, indent: project.indent};
            });
        }
        const selectedOption = this.state.selectedOption ? this.state.selectedOption : (currentProject ? currentProject : inboxProject);

        return (
            <div>
                <SimpleSelect
                    options={options}
                    value={selectedOption}
                    onValueChange={(item) => {
                        this.setState({selectedOption: item})
                        this.props.onChange(item ? item.value : null);
                    }}
                    renderOption={(item) =>{
                        return (
                            <div className={"simple-option n1todoist-project-listitem n1todoist-project-listitem-indent--"+item.indent}>
                                <span className={"n1todoist-project-listitem__color n1todoist-color--" + item.color}></span>
                                <span className="n1todoist-project-listitem__label">{item.label}</span>
                            </div>
                        );
                    }}
                    renderValue={(item) =>{
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
    }

    onProjectStoreChange = () => {
        this._setStateFromProjectStore();
    }

    onTaskStoreChange = () => {
        const currTask = TodoistTaskStore.taskForFocusedContent();
        if(currTask !== null){
            const currProjectId = currTask.project_id ? currTask.project_id : null;
            this.setState({
                current_project_id: currProjectId
            })
        }

    }

    _setStateFromProjectStore = () => {
        this.setState({
            projects: TodoistProjectStore.getProjects()
        });
    }
}
