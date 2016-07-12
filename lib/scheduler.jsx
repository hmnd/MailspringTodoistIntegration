import {
    Utils,
    React,
    ReactDOM,

} from 'nylas-exports';


export default class Scheduler extends React.Component{

    constructor(props){
        super(props);
    }

    state = {
        selectedDay: new Date()
    }

    handleChange(date) {
        this.setState({
            selectedDay : date
        });
    }

    render(){
        return (
            <div>Test</div>
        );
    }
}
