import { React } from 'nylas-exports';

import TodoistTaskStore from './todoist-task-store';

export default class TodoistLabel extends React.Component{
    static displayName = 'TodoistLabel';

    static propTypes = {
        thread: React.PropTypes.object,
    };

    constructor(props){
        super(props);
        this.state = {
            hasTask: this._hasTask(),
            done: this._isDone()
        };
    }

    componentDidMount(){
        this._unsubscribe = TodoistTaskStore.listen(this.onTaskStoreChange);
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onTaskStoreChange = () => {
        this.setState({
            hasTask: this._hasTask(),
            done: this._isDone()
        })
    }

    render(){
        if(this.state.hasTask){
            return <div className={"mail-label n1todoist-maillabel" + (this.state.done ? " done" : "")}>Task</div>
        }else{
            return null
        }
    }

    _hasTask(){
        const task = TodoistTaskStore.getTaskByClientId(this.props.thread.clientId)
        return task ? true : false;
    }

    _isDone(){
        const task = TodoistTaskStore.getTaskByClientId(this.props.thread.clientId)
        return task ? task.done : false;
    }

}

