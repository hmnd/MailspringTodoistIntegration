import {
    React
} from 'nylas-exports';


module.exports = React.createClass({

    render: function(){
        return <button className="n1todoist-logout" onClick={this.handleLogoutClick}> Logout </button>
    },


    handleLogoutClick: function(){
        localStorage.removeItem("N1todoist_authentication");
        this.props.whenLoggedOut();
    },


});
