import {
    Utils,
    React,
    FocusedContactsStore
} from 'nylas-exports';

import Login from './login';
import Logout from './logout';

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
            authenticated: localStorage.getItem('N1todoist_authentication') !== null ? true : false
        }
    },

    render: function(){
        if(!this.state.authenticated){
            return <Login whenLoggedIn={this.handleLogin} credentials={todoistCredentials}/>
        }else{
            return <Logout whenLoggedOut={this.handleLogout}/>
        }
    },

    handleLogin: function(){
        this.setState({authenticated: true});
    },

    handleLogout: function(){
        this.setState({authenticated: false});
    }



});
