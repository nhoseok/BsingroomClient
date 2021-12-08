import React, {useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import chatbutton from '../../img/채팅전송버튼.png';
import bsing from '../../img/B대면노래방.png';
import { UserDispatch } from '../../app.js'
import Leave from './leave';
import SendChat from './sendChat'
import mute from "../../img/iconfinder-mute-mic-microphone-audio-sound-4593173_122241.png";
import unmute from "../../img/microphone-black-shape_icon-icons.com_73491.png";




const Background = styled.div`
    /* 배경 */
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #252F8C 0%, rgba(32, 60, 130, 0.6) 25.52%, rgba(38, 146, 170, 0.76) 66.67%, #843199 100%);
    //background: linear-gradient(180deg, #27258C 0%, rgba(32, 60, 130, 0.94) 31.25%, rgba(66, 149, 168, 0.81) 64.58%, rgba(119, 132, 41, 0.76) 95.31%);
    box-sizing: border-box;
`

const Left = styled.div`
    /* 왼쪽 (예약목록, 참가자) */
    display:flex;
    flex-direction: column;
    flex:2;
    width: 100%;
    height: 100%;
    font-size: 1em;
    color: white;
    padding: 0.25em 1em;
    box-sizing: border-box;
`

const Center = styled.div`
    /* 가운데(방제, 영상, 현재곡, 반주예약, 장치조절) */
    display:flex;
    flex-direction: column;
    flex:5;
    width: 100%auto;
    height: 100%auto;
    color: white;
    padding: 0.25em 1em;
    box-sizing: border-box;
`

const Right = styled.div`
    /* 오른쪽(네트워크 신호, 채팅창, 채팅전송) */
    position: relative;
    display:flex;
    flex-direction: column; 
    flex:2;
    width: 100%auto;
    height: 100%auto;
    color: white;
    padding: 0.25em 1em;
    box-sizing: border-box;
`

const List = styled.div`
    /* 예약 목록 & 참가자 테두리 */   
    display: flex;
    flex:5;
    flex-direction: column;
    position: relative;
    //width: auto;
    //height: auto;
    margin: 0.25em;
    padding: 0.7em 0.7em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    background-color:rgba(255, 255, 255, 0.1);
    box-sizing: content-box;
`

const Copyright = styled.div`
    /* 소웨공 1조 */
    display: flex;
    flex:1;
    position: relative;
    font-size: 10px;
    align-items: center;
    justify-content: center;
    margin: 0.25em;
    padding: 0.25em 0.25em;
`


const Roomname = styled.div`
    /* 방제 */ 
    flex:1;
    width: 100%;
    height: auto;
    margin: 0.25em;
    padding: 0.25em 0.25em;
    border: 2px solid palevioletred;
    border-radius: 1px;
    border-color: transparent; 
    box-sizing: content-box;
`

const ViewTextarea = styled.div`
    /* 방제, 현재곡 텍스트 */
    flex: 1;
    align-items:'center';
    width: 85%;
    font-size: 30px;
    color: white;
    background: transparent;
    border: none;
    box-sizing: content-box;
`

const ReserveSong = styled.div`
    /* 노래 예약 */
    flex:4;
    position: relative;
    width: auto;
    height: 20%;
    margin: 0.25em;
    padding: 0.25em 0.25em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    background-color:rgba(255, 255, 255, 0.1);
`

const SongReserveButton = styled.button`
    /* 노래 예약 버튼 */ 
    position: relative;
    align-items: center;
    width: 60px; 
    height: 30px;
    margin-top: 5%;
    margin-left: 75%;
    color: black;
    background: #86E57F;
    border: solid 1px #777777;
    border-radius: 10px;
    box-shadow: 2px 2px navy;
    &:hover {
        background: lightgreen;}
    &:active {
        background: #59DA50;}
`

const Sound = styled.div`
    /* 장치 조절 */
    flex: 2;
    display: flex;
    justify-content: center;
    align-items:'center';
    width: auto;
    height: auto;
    margin: 0.25em;
    padding: 0.25em 0.25em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    background-color:rgba(255, 255, 255, 0.1);
`

const NetworkStatus = styled.div`
    /* 네트워크 상태 */
    display: flex;
    flex:1;
    position: relative;
    width: auto;
    height: auto;
    margin: 0.25em;
    padding: 0.7em 0.7em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    background-color:rgba(255, 255, 255, 0.1);
`

const Chatting = styled.div`
    /* 채팅 박스 */
    display: flex;
    flex-direction: column;
    flex: 10;
    position: relative;
    width: auto;
    height: 390px;
    margin: 0.25em;
    padding: 0.7em 0.7em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    word-break:break-all;
    background-color:rgba(255, 255, 255, 0.1);
`

const ChatInput = styled.div`
    /* 채팅 입력 */
    display: flex;
    flex:3;
    position: relative;
    justify-content: center;
    width: auto;
    height: auto;
    padding: 0.7em 0.7em;
    border: 1px solid palevioletred;
    border-color: lightgray;
    border-radius: 10px;
    background-color:transparent;
    word-break:break-all;
`


const Exit = styled.div`
    /* 방 나가기 구역 */
    display: flex;
    flex:2;
    align-items: center;
    justify-content: center;
`

const ExitButton = styled.button`
    /* 방 나가기 버튼 */
    justify-content: center;
    position: relative;
    cursor: pointer;
    box-shadow: 3px 3px navy;
`

const Mute = styled.img`
    width: 20px;
    height: 20px;
`

const Unmute = styled.img`
    width: 20px;
    height: 20px;
`

const store = []

function Room() {
    const navigate = useNavigate(); 

    const {user, setuser} = useContext(UserDispatch);

    const [members, setMembers] = useState([]);
    let connections = [];
    let songList = [];

    const [chats, setChats] = useState([
    ])

    const video = useRef(null);
    
    let audioCtx = new AudioContext();


    const [rooms, setRooms] = useState([]);

    useEffect(()=>{
        

        //Youtube API
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        //audio event 등록
        
        user.socket.on("offer", (offer, senderID) => {
            setOffer(offer, senderID);
          });
        
        user.socket.on("answer", (answer, senderID) => {
            setAnswer(answer, senderID);
        });

        user.socket.on("ice", (ice, senderID) => {
            setIce(ice, senderID);
          });


        //Room event 등록
        user.socket.emit('fetchMember', user.roomInfo)
     
        user.socket.on("showMemberList", (data, joined)=>{
            if(data.length>members){
                addAudioConnect(joined,data);
            }
            else{
                audioDisConnect(joined,data);
            }
            let memberList = [];
            for(const value of data){
                memberList.push([value.icon, value.nickname]) 
            }
            console.log(memberList)
            setMembers(memberList)
            console.log(members)
        })

        //서버에서 채팅 내용  받기

        user.socket.on('showChat', (content) => {        //socketOn 이벤트는 리렌더링할 때마다 수가 늘어난다.  
            store.push(content)
            setChats([...chats, ...store])
        })

        //

        user.socket.on("breakRoom",()=>{
            exitToLobby()
        })

        return ()=>{
            user.socket.removeAllListeners();
            connection.close();
            connection = null;
            audioCtx = null;
        }
    }, [])

    //Audio connection 함수
    const setOffer = async (offer, senderID) => {
        console.log(connections.find(data=> data.id == senderID), senderID)
        let offerConn = connections.find(data=> data.id == senderID).connection
        offerConn.setRemoteDescription(offer);
        offerConn.createAnswer()
        .then((result)=>{
            console.log(result)
            offerConn.setLocalDescription(result);
            user.socket.emit("answer", result, senderID);
        })
    }

    const setAnswer = (answer, senderID) => {
        let answerConn = connections.find(data=> data.id == senderID).connection
        answerConn.setRemoteDescription(answer);
    }
    
    const setIce = (ice, senderID) =>{
        let iceConn = connections.find(data=> data.id == senderID).connection
        iceConn.addIceCandidate(ice);
    }

    const addAudioConnect=(join, data)=>{

        console.log(members, data)

        for(const value of data){
            if(!members.includes(value.nickname)&&value.nickname!=user.nickname){
                let connection = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: [
                                "stun:stun1.l.google.com:19302",
                                "stun:stun2.l.google.com:19302",
                                "stun:stun3.l.google.com:19302",
                                "stun:stun4.l.google.com:19302",
                            ]
                        }
                    ]
            
                })
                connections.push({id:value.id, connection:connection})

                user.mediaStream.getTracks().forEach(track =>{
                    connection.addTrack(track, user.mediaStream)
                })
                if(join){
                connection.createOffer()
                .then((result)=>{
                    console.log(result)
                    connection.setLocalDescription(result)
                    user.socket.emit("offer", result, value.id)
                })
            }
                connection.addEventListener("icecandidate", (ice)=>{
                    console.log(ice)
                    user.socket.emit("ice", ice.candidate, value.id )
                })
                
                connection.addEventListener("addstream", (data)=>{
                    console.log("addStream");
                    video.current.srcObject = data.stream;
                    var gainlocalNode = audioCtx.createGain();
                    gainlocalNode.gain.value = 0.5;
                    audioCtx.createMediaStreamSource(data.stream);
                    gainlocalNode.connect(audioCtx.destination);
                    video.current.play();
                })
            }
        }
    }

    const audioDisConnect=(data)=>{
        console.log(members, data)
    }

    const createReserv = (e) =>{
        e.preventDefault();
        //https://www.youtube.com/watch?v=3duS7p-H6KQ
        // https://www.youtube.com/watch?v=gX0rdGE8tW8
        const url = e.target.url;
        const song = new YT.Player('player', {
            height: '300px',
            width: '100%',
            videoId: 'gX0rdGE8tW8',
            events: {
                'onReady': (event)=>{
                    event.target.playVideo();
                }
            }
          });
        console.log(song)
        //user.socket.emit('createReserv', url);
    }

    //채팅 입력해서 서버로 보내기
    const [inputs, setInputs] = useState({
        chat: '',
    })

    const { chat } = inputs;

    const onChange = (e) => {
        const { name, value } = e.target; // 우선 e.target 에서 name 과 value 를 추출
        setInputs({
          ...inputs,                      // 기존의 input 객체를 복사한 뒤
          [name]: value                   // name 키를 가진 값을 value 로 설정
        });
      };
    

    const onSubmit = (e) => {   
        e.preventDefault();
        setInputs({chat:''})
        user.socket.emit('sendChat', user.roomInfo, chat)
    };

    // 채팅 받아서 띄우기
    
    
    const chatList = () => {
        return chats.map((data, index) => (
			<p key={index}>
					{data}
			</p>
		)) 
    };

    const [toggle, setToggle] = useState(false);


    const onMute = () => {
        if (toggle == false){
            setToggle(true)
        } else {
            setToggle(false)
        }

    }

    const showMembers = () => {
        console.log(mute)
        return members.map((data, index) => (
            <div key={index}>
                {data[0]} <span>{data[1]}</span> <button onClick={onMute} style={{float:'right'}}>{toggle ? <Mute src={mute}></Mute> : <Unmute src={unmute}></Unmute>}</button>
            </div>
        ))
    };

    const exitToLobby = () =>{
        store.splice(0)
        user.socket.emit('leaveRoom', user.roomInfo, user.host)
        user.host=false;
        navigate('/lobby', {replace:true, state: { nickname : user.nickname, icon : user.userIcon}})
    }

    console.log(user);
    console.log(user.roomInfo);

    

    return (
        <Background>
        
        <Left>

            <List>
                <div>
                예약목록 <br></br><br></br>
                <textarea cols="25" rows="15" 
                        style={{backgroundColor: "rgba(255,255,255,0.5)", 
                        resize: "none"}}>
                    <input type='text'></input>
                </textarea>
                </div>
            </List>

            <List>

            <div style={{ width: '100%', flex: '1' }}>채팅</div>
            <div style={{ width: '100%', flex: '9' }}>
                    {showMembers()} 
                    </div>
            
                 
            </List>

            <Copyright><center>
                @Copyright 소프트웨어 공학 1조
            </center></Copyright>

        </Left>

        <Center>
            
        
            <ViewTextarea>{user.roomInfo.substr(5)}</ViewTextarea>
            
            <div width="100%" id='player' style={{flex:8}}>
                <video ref={video}></video>
            </div>           
            
            <ViewTextarea>현재곡: </ViewTextarea>

            <ReserveSong>
                
                <form onSubmit={createReserv}><center>
                    <input type='url' placeholder='반주 URL' 
                        style={{position: 'relative', top:'20px', 
                                width:"70%", height:"25px",
                                border:"none", borderRadius:"5px"}}
                        name = "url">
                    </input><br></br><br></br></center>
                    <SongReserveButton type='submit'>예약</SongReserveButton>
                </form>
                
            </ReserveSong>
            
            <Sound>
                Input <input type='range'></input> 
                Output <input type='range'></input>
            </Sound> 

        </Center>

        <Right>
            
            <NetworkStatus>
                (네트워크 신호)
            </NetworkStatus>

            <Chatting>
                    <div style={{ width: '100%', flex: '1' }}>채팅</div>
                    <div style={{ overflow: 'auto', width: '100%', flex: '9' }}>
                        {chatList()}
                    </div>
            </Chatting>

            <ChatInput>
                    <SendChat style={{ whitespace: "pre-line" }}
                        chat={chat}
                        onChange={onChange}
                        onSubmit={onSubmit}
                    />
            </ChatInput>
            

            <Exit>
                <ExitButton onClick={exitToLobby} 
                            style={{height:"30px", width:"100px",
                            backgroundColor: "#8F2121",
                            backgroundRadius: "10px",
                            border: "solid 1px black",
                            borderRadius: "10px",
                            color: "#E88989"}} >
                방 나가기 </ExitButton>
            </Exit>

        </Right>
        
        </Background>
    )
}

export default Room;