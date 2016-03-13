import {Utils,
 React,
 FocusedContactsStore} from 'nylas-exports'

var todoistCredentials = {
   url: 'https://todoist.com/API/v6/sync',
   clientSecret: 'de5502a2394144bf8bada72848c7ce41',
   clientId: 'e917bc71c8ad4786a47ca230263f9208'
}

module.exports = React.createClass({
   render: function(){
      if(!this._isLoggedIn()){
            return this._renderLogin();
      }else{
         return <div>Logout</div>
      }


   },

   _isLoggedIn: function (){
      var authentication = localStorage.getItem('N1todoist_authentication');
      return authentication !== null;
   },

   _renderLogin: function(){
      return <div> Login </div>
   }
});
