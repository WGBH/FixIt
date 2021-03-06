import React from 'react'
import LeaderList from '../partials/leader_list'

class LeaderBoard extends React.Component {
  render(){
    const { leaderboard } = this.props
    return (
      <div>
        <div className="grid">
          <h1>Leader Board</h1>
        </div>
        <div className="grid">
          <LeaderList
            list={leaderboard.all_time}
            title={'All Games All Time'}
            type={'all-games'}
            gameNumber={false}
          />
          <LeaderList
            list={leaderboard.past_month}
            title={'All Games Monthly'}
            type={'all-games'}
            gameNumber={false}
          />
          <LeaderList
            list={leaderboard.past_week}
            title={'All Games Weekly'}
            type={'all-games'}
            gameNumber={false}
          />
          <LeaderList
            list={leaderboard.game_one_all_time}
            title={'All Time'}
            type={'game'}
            gameNumber={1}
          />
          <LeaderList
            list={leaderboard.game_two_all_time}
            title={'All Time'}
            type={'game'}
            gameNumber={2}
          />
          <LeaderList
            list={leaderboard.game_three_all_time}
            title={'All Time'}
            type={'game'}
            gameNumber={3}
          />
        </div>
      </div>
    )
  }
}
export default LeaderBoard;
