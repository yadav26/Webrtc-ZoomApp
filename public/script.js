//https://www.youtube.com/watch?v=DvlyzDZDEq4

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, 
    { port: 3001, host: '/' });

const myVideo = document.createElement('video')
const peers = {}

myVideo.muted = true
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then( stream=>{
    addvideostream(myVideo,stream)

    const video = document.createElement('video')
    myPeer.on('call', call=>{
        call.answer(stream)
        call.on('stream', userVideoStream=>{
            addvideostream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId=>{
        connectToNewUser(userId, stream)
    })
})
//windows privacy microphone to be on 
//windows privacy camera to be on 
//browser to verify if right camera source
function connectToNewUser(userId,stream)
{
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream=>{
        addvideostream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] = call

}

myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', user =>{
    console.log('connected user - '+user)
    
})

socket.on('user-disconnected', user =>{
    console.log('Disconnected user - '+user)
    if(peers[user])
        peers[user].close()
})
function addvideostream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}