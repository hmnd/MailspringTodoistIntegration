import { React } from 'nylas-exports';

export default class Logout extends React.Component{
    
    static propTypes = {
        whenLoggedOut: React.PropTypes.func,
    }

    render(){
        return <button className="n1todoist-logout" onClick={this.handleLogoutClick}> Logout </button>
    }

    handleLogoutClick = () => {
        localStorage.removeItem("N1todoist_authentication");
        this.props.whenLoggedOut();
    }
}
