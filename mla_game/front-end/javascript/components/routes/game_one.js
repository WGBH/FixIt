import React from 'react'
import { Link } from 'react-router'
import GameLoader from '../partials/game_loader'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/game_one_phrase'
import Paging from '../partials/paginator'
import { postData } from '../../helpers'
import GameFooter from '../partials/game_footer'
import GameTip from '../partials/game_tip'
import ChangeTranscript from '../partials/change_transcript'
import { patchData } from '../../helpers'
import MenuFooter from '../partials/menu_footer'

class GameOne extends React.Component{

  constructor(){
    super()
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)
    this.reload = this.reload.bind(this)

    this.state = {
      wrongPhrases:{},
      playablePhrases:{}
    }  
  }

  selectPhrase(phrase, pk, button){
    // reference state
    const wrongPhrases = {...this.state.wrongPhrases};
    // keys
    let key = `phrase-${pk}`
    let keyExists = key in wrongPhrases;
    wrongPhrases[key] = phrase;
    
    // push object to state only if it already doesn't exist
    // and set the class name accordingly
    if(keyExists){
      // remove item and set state
      delete wrongPhrases[key];
      this.setState({ wrongPhrases })
      // reset button to default state
      button.className = 'text'
    } else {
      this.setState({ wrongPhrases });
      // set button to higlighted state
      button.className = 'text highlighted'
    }
  } 
  
  handleProgress() {
    const { gameone, setIsPlaying, setCurrentTime, playPhrase, wait, advanceSegment, updateTotalScore, updateGameScore } = this.props
    
    // copy state
    const wrongPhrases = {...this.state.wrongPhrases}
    let userPk = this.props.initialData.user[0].pk
    let phrasesNotPickedPlayable = []


    gameone.phrases.map(function(index, keys) {
      let active = gameone.segment,
          key = `phrase-${index.pk}`,
          inWrongList = key in wrongPhrases,
          usercanVote = index.user_can_vote,
          currentSegment = active === keys || active === keys + 1 || active === keys -1

      // check the current segment
      if(currentSegment) {
        // check if all phrases in the current segment are not marked as incorrect and if the user can vote on it
        if(!inWrongList && usercanVote) {
          phrasesNotPickedPlayable.push(index.pk)
        }
      }
    })

    // POST phrases that that are in play and not marked with upvote true
    for (var i = 0; i < phrasesNotPickedPlayable.length; i++) {
      let data = {
        upvote:true,
        transcript_phrase: phrasesNotPickedPlayable[i]
      }
      // helper ajax function to post downvote
      postData('/api/transcriptphrasevote/', data)
    }

    // patch considered phrases for game one    
    
    // disable advance round for three seconds when round updates
    wait(3000)
    
    // check if the round has ended. if so change state. 
    // if not push other things to state like the score and play the media    
    if(gameone.segment <= gameone.phrases.length) {
      // update round
      var media = document.querySelector('.audio-player');
      media.currentTime = gameone.startSegment;
      media.play();
      
      advanceSegment(3)
      updateTotalScore(1)
      updateGameScore(1)

      let segmentScore = {
        game:'1',
        score:1
      }
      postData('/api/score/', segmentScore)

    }

    // data push for phrases if they exist
    let noPhrases = Object.keys(wrongPhrases).length === 0 && wrongPhrases.constructor === Object
    if(noPhrases) {
      return
    } else {
      for(let key in wrongPhrases){
        // construct object for upvote
        // POST phrases that have been marked incorrect with upvote false
        let data = {
          upvote: false,
          transcript_phrase: wrongPhrases[key].pk
        }
        // helper ajax function to post downvote
        postData('/api/transcriptphrasevote/', data)

        this.props.updateTotalScore(1)
        this.props.updateGameScore(1)
        let phraseScore = {
          game:'1',
          score:1
        }
        postData('/api/score/', phraseScore)
      }
      // clean state
      this.setState({
        wrongPhrases:{},
        playablePhrases:{}
      })
    }
  }

  activePhrase(time, start, end){
    const playingPhrase = time <= start || time >= end; 
    if(playingPhrase) {
      return(
        'not-active-phrase'
      )
    } else {
      return(
        'active-phrase'
      )
    }
  }

  playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }
  
  reload(){
    let tipDismissed = this.props.gameone.inGameTip
    this.props.resetSegments(0)
    this.props.resetGameScore(0)
    this.props.endOfRoundOne(false)
    this.props.gameReady(false)
    this.props.fetchGameOne()
    if(tipDismissed) {
      this.props.showTipTwo(false)
    }
  }
  
  componentWillMount(){
    this.props.fetchGameOne()
  }

  componentWillUnmount(){
    // update gameone score in state
    if(!this.props.gameone.endOfRound) {
      this.props.updateGameOneScore(this.props.gameone.gameScore)
    }
    this.reload()
  }
  render(){
    const { gameReady, initialData, gameScores, gameone, gametwo, gamethree, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegment } = this.props

    if(!gameone.gameReady) {
      let linkOne = {
        link:'gametwo',
        number:2
      },
        linkTwo = {
        link:'gamethree',
        number:3
      }
      return(
        <GameLoader
          loading={gameone.loading}
          loadingData={initialData.loading_data} 
          gameReady={gameReady}
          gameNumber={gameone.gameNumber}
          transcriptsData={gameone.phrases.length}
          firstGameLink={linkOne}
          secondGameLink={linkTwo}
          noDataMessage={'Please play Game 2 to provide transcript fixes or Game 3 to validate transcript fixes.'}
          message={initialData.message}
        />
      )
    } else {
      return(
        <div>
          <div className="grid">
            <div className='game-meta'>
              {gameone.endOfRound ? (
                ''
              ) : (
                <div>
                  <Audio 
                    isPlaying={gameone.isPlaying}
                    src={gameone.media_url} 
                    setCurrentTime={setCurrentTime}
                    setIsPlaying={setIsPlaying}
                    startTime={gameone.startTime} 
                    endSegment={gameone.endSegment}
                    startSegment={gameone.startSegment}
                  />
                  <GameMeta
                    meta={gameone.metadata} 
                    aapb_link={gameone.aapb_link}
                    sources={gameone.source}
                  />
                  <ChangeTranscript
                    reload={this.reload}
                    pk={gameone.pk}
                    user={this.props.initialData.user[0].pk}
                  />
                </div>
              )}
            </div>
            {gameone.endOfRound ? (
              <div className='roundup'>
                <h2 className="user-message">{this.props.initialData.user[0].username} Just Scored: {gameone.gameScore} Points</h2>
                <ul className='game-navigation'>
                  <li>
                    <h2><span className='game-number'>{gameone.gameNumber}</span> <span className='game-name'>{gameone.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_one_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' onClick={() => this.reload()}>Play</Link>
                  </li>
                  <li>
                    <h2><span className='game-number'>{gametwo.gameNumber}</span> <span className='game-name'>{gametwo.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_two_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' to="gametwo">Play</Link>
                  </li>
                  <li>
                    <h2><span className='game-number'>{gamethree.gameNumber}</span> <span className='game-name'>{gamethree.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_three_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' to="gamethree">Play</Link>
                  </li>
                </ul>
                <MenuFooter
                  endOfRound={'game_one'}
                  user={this.props.initialData.user[0].pk}
                  gameScore={this.props.gameone.gameScore}
                  updateScore={this.props.updateGameOneScore} 
                />
              </div>
            ) : (
              <div>
                <ul className="game-phrase-list">                
                  {gameone.phrases.map((index, key) => {
                  let items = Number(key);
                  let currentRound = gameone.segment <= items + 4 && gameone.segment >= items -4;
                  let last = gameone.segment == items + 4;
                  
                   if(currentRound) {
                    return(
                      <li key={key} className={this.activePhrase(gameone.currentTime, index.start_time, index.end_time)}>
                        <Phrase
                           selectPhrase={this.selectPhrase}
                           playPhrase={this.playPhrase}
                           endOfRoundOne={this.props.endOfRoundOne}
                           time={gameone.currentTime} 
                           active={gameone.segment}
                           length={gameone.phrases.length}
                           keys={key}
                           details={index}
                           wrongPhrases={gameone.wrongPhrases}
                           setSegmentStart={setSegmentStart}
                           setSegmentEnd={setSegmentEnd}
                           advanceSegment={advanceSegment}                      
                        />
                      </li>
                     )
                    }
                 })}
                </ul>
              </div>    
            )}
          </div>
          {gameone.endOfRound ? (
            ''
          ) : (
            <GameFooter
              gameNumber={gameone.gameNumber}
              gameName={gameone.gameName}
              handleProgress={this.handleProgress}
              max={gameone.phrases.length}
              value={gameone.segment + 3}
              waitingUpdate={this.props.waitingUpdate}
              waiting={this.props.gameone.waiting}
              modalIsOpen={this.props.initialData.modalIsOpen}
              setModal={this.props.setModal}
              gameTipsClass={'tip-gameone'}
              gameCookie={'gameoneCookie'}
            />
          )}
        </div>
      )
    }
  }
}
export default GameOne;