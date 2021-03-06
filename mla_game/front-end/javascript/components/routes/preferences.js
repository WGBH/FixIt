import React from 'react'
import UserForm from '../partials/user_form'
import PreferencesForm from '../partials/preferences_form'
import UserMessage from '../partials/user_message'

class Preferences extends React.Component{

  componentWillUnmount(){
    this.props.fetchData()
  }
  
  render(){
    return (
      <div className="preferences">
        <div className="user-form">
          <div className="grid user-form-message">
            <p>Below, you can customize the username that other players see in FIX IT.</p>
          </div>
          <div className="grid">
            <span className="user">{this.props.initialData.username}</span>
            <UserForm 
              data={this.props.initialData} 
              setUsername={this.props.setUsername}
            />
          </div>
        </div>
        <div className="message">
          <div className="grid">
            <UserMessage 
              message={this.props.initialData.message}
              toggleMessage={this.props.setPreferencesMessage}
              isVisible={this.props.userMessages.messagePreferences}
            />
          </div>
        </div>
        <PreferencesForm 
          user={this.props.initialData.user[0].pk}
          topics={this.props.preferencesOptions.topics}
          source={this.props.preferencesOptions.source}
          preferred_topics={this.props.initialData.user[0].preferred_topics}
          preferred_stations={this.props.initialData.user[0].preferred_stations}
        />
      </div>
    )
  }

};
export default Preferences;