//let api_key = "AIzaSyCb-h04GlqllVBT8LCViUAYyRG6RFIbTLw";
//let api_key = "AIzaSyAaHr2tgwrK4VR75Papb13n82s51ZuDCQU";
let api_key = "AIzaSyC24UJisR6rw3SlBrE2Z20kiqzX-Usqhwo";
let videos_list = "https://www.googleapis.com/youtube/v3/videos?";
let Channel_list = "https://www.googleapis.com/youtube/v3/channels?";
let playlist = "https://www.googleapis.com/youtube/v3/playlists?";
let searchlist = "https://www.googleapis.com/youtube/v3/search?"
let searchterm = '';

fetch(videos_list + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 20,
    regionCode: 'IN'
}))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannellist(item);
        });
    })
    .catch(err => console.log(err));

getChannellist = (item) => {
    fetch(Channel_list + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: item.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            item.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            console.log(item, 'items')
            makeVideo(item, data);
        })
}

let html = '';
makeVideo = (item, data) => {
    html += `
    <div class="card col-lg-3 col-sm-12 col-md-6 border-0 mt-5 video-card" onclick="getChannelDetails('${item.id}');getchannelPlaylist('${item.snippet.channelId}')">
    <img src="${item.snippet.thumbnails.maxres.url}" class="rounded-3" alt="...">
    <div class="row">
    <div class="card-body d-flex align-items-md-start">
        <img src="${item.channelThumbnail}" class ="rounded-circle me-2 card_img">
        <p class="titleName">"${item.snippet.title}"</p>
        <img src="./assets/dots.JPG">
    </div>
    <p class="text-black-80 ms-5 text_size"> ${item.snippet.channelTitle}
    </p>
</div>
</div>`
    document.getElementById("videoCard").innerHTML = html;
}

getChannelDetails = (id) => {
    fetch(videos_list + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: id
    }))
        .then(res => res.json())
        .then(data => {
            document.getElementById("playlist-page").style.display = 'block';
            document.getElementById("landing-page").style.display = 'none';
            makePlaylistHeader(data);
            //getPlaylist(id);

        })
}

makePlaylistHeader = (data) => {
    let headerHtml = '';
    headerHtml = `
    <div>
    <img src="${data.items[0].snippet.thumbnails.maxres.url}" class = "playlist_head" alt="">
    </div>

<div class="row mt-4">
    <div class= "d-flex col-1 justify-content-start">
    <img src="${data.items[0].snippet.thumbnails.default.url}" class="playlist_icon " alt="">
    </div>  

    <div class= "col-8">
    <p class="fs-3 mb-0">${data.items[0].snippet.channelTitle}</p>
    <p class="fs-6 mb-0">@${data.items[0].snippet.channelTitle}</p>
    <p class="fs-6 mb-0">5.53M Subscribers</p>
    </div>  

    <div class= "col-2 justify-content-end">
        <button type="button" class="btn btn-dark">Subscribe</button>
    </div> 
</div>
    `;

    document.getElementById("playlist-header").innerHTML = headerHtml;
}

getchannelPlaylist = (channelId) => {
    fetch(playlist + new URLSearchParams({
        key: api_key,
        part: 'snippet,contentDetails,player,id',
        channelId: channelId
    }))
        .then(res => res.json())
        .then(data => {
            data.items.forEach(item => {
                makePlaylistVideos(item);
            })
        })
}

let playlistvideohtml = ''
makePlaylistVideos = (item) => {
    playlistvideohtml += `
    <div class="card col-lg-2 col-sm-12 col-md-6 border-0 mt-5">
    <img src="${item.snippet.thumbnails.medium.url}" class="rounded-3" alt="...">
    <div class="row">
    <div class="card-body d-flex align-items-md-start">
        <p class="titleName">${item.snippet.title}</p>
    </div>
    <p class="text-black-80 text_size">View full playlist</p>
</div>
</div>`;
    document.getElementById('playlist-videos').innerHTML = playlistvideohtml;
}

homepage = () => {
    document.getElementById("playlist-page").style.display = 'none';
    document.getElementById("landing-page").style.display = 'block';
    document.getElementById("search-block").style.display = 'none';
    document.getElementById('search-input').value = '';
}

getSearchData = () => {
    const term = document.getElementById('search-input').value;
    document.getElementById("playlist-page").style.display = 'none';
    document.getElementById("landing-page").style.display = 'none';
    document.getElementById("search-block").style.display = 'block';
    fetch(searchlist + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        type: 'channel, playlist, video',
        q: term
    }))
        .then(res => res.json())
        .then(data => {

            data.items.forEach(item => {
                createSearchReasult(item);
            });
        })
        .catch(err => console.log(err));
}

let searchResult = '';
createSearchReasult = (item) => {

    searchResult += `
    <div class="row py-3">
        <div class="card col-lg-4 col-sm-12 col-md-12 border-0 search-card">
            <img src="${item.snippet.thumbnails.high.url}" class="rounded-3" alt="...">
                        </div>

                        <div class="col-lg-8 col-sm-12 col-md-12">
                            <p class="fs-3 mb-0 search_title">${item.snippet.title}</p>
                            <p class="fs-6">110M views . 3 years ago</p>
                            <img src="${item.snippet.thumbnails.medium.url}" class ="rounded-circle me-2 card_img"><span>${item.snippet.channelTitle}</span>
                            <p class="fs-6 mt-3 ">${item.snippet.description}</p>
                            
                        </div>
                        </div>`

    document.getElementById('search_result_container').innerHTML = searchResult;


}

myPageLoad = () => {

    var input = document.getElementById("search-input");

    input && input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchResult = '';
            document.getElementById("search-click").click();
        }
    });
}
