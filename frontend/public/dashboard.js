
cookies = document.cookie
pairs = document.cookie.split('; ')
for (i of pairs) {
    pair = i.split('=')
    if(pair[0] === 'mail') mail = pair[1]
    else if(pair[0] === 'pwd') pwd = pair[1]
}

opened = -1
out = 0;
// cardTemplate = 
// `
// <div class="notescard">
//                         <div class="notestop">
//                             <div class="notestitle">${title}</div>
//                             <i class="material-icons delnote" style="font-size: 20px;">delete</i>
//                         </div>
//                         <div class="notescontent">${cont}</div>
//                     </div>
// `

addNoteTemplate = 
`
<div id="addnote" style="opacity:30%" onclick="addNote()">
                        <i class="material-icons" style="font-size:140px">add</i>
                    </div>
`

async function getNotes() {
    let response = await fetch('/getnotes', {
        method: 'POST',
        body: JSON.stringify({
            mail,pwd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    let resobj = await response.json()

    return JSON.parse(resobj).notes
    
}

async function setNotes(notes) {
    let response = await fetch('/setNotes',{
        method: 'POST',
        body: JSON.stringify({
            mail,pwd,notes
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }

    })
    resobj = JSON.parse(await response.json()) 
    if (resobj.status === 'success') {
        return resobj.notes;
    }
}

async function getInfo(){
    let response = await fetch('/userinfo', {
        method: 'POST',
        body: JSON.stringify({
            mail,pwd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    let resobj = await response.json()
    
    
    return resobj.info
}

async function plotNotes(filter=false){
    notes = await getNotes()
    if(!filter){
        filter = notes
    }
    content = ''
    index = 1
    for (note of notes) {
        if (filter.includes(note)) show = 'block'
        else show = 'none'
        title = (note+'          ').slice(0,12)
        cont = note
        content += `
        <div class="notescard" id="note${index++}" style="display:${show}">
                                <div class="notestop">
                                    <div class="notestitle">${title}</div>
                                    <i class="material-icons delnote" style="font-size: 20px;">delete</i>
                                </div>
                                <div class="notescontent">${cont}</div>
                            </div>
        `
        }
    notesarea.innerHTML = content+addNoteTemplate
    notescount.innerHTML = `<em>${notes.length} notes</em>`
    addClickListeners()
    plotInfo()
    return ''
}

async function plotInfo(){
    info = await getInfo()
    user.innerHTML = info.name.split(' ')[0];
    username.innerHTML = info.name;
    usermail.innerHTML = info.mail;
    phone.innerHTML = `Phone: ${info.phone}`;
}

function addClickListeners(){
    function delListener(id){
        return async()=>{
            
            notes = await getNotes()
            notes.splice(id,1)
            await setNotes(notes)
            
            searchnotes()
        } 
    }
    function openListener(id){
        return async()=>{
            notevalue.value = (await getNotes())[id]
            opened = id
            editor.style.display = 'block'
            document.getElementById('content').style.display = 'none'
        }
    }

    cards = document.querySelectorAll('.notescard')
    i = 0;
    for (card of cards) {
        document.querySelector(`#${card.id} i`).addEventListener('click', delListener(i));
        document.querySelector(`#${card.id} .notescontent`).addEventListener('click', openListener(i++));
    }
}

async function addNote(){
    notes = await getNotes()
    opened = notes.length
    editor.style.display = 'block'
    document.getElementById('content').style.display = 'none'
    searchbar.value = ''
}

function logout(){
    document.cookie = 'mail=null'
    document.cookie = 'pwd=null'
    location.href = '/'
}

async function searchnotes(){
    searchValue = searchbar.value
    notes = await getNotes()
    todisplay = []
    for (note of notes){
        
        if (note.toLowerCase().includes(searchValue.toLowerCase())){
            todisplay.push(note)
        }
    }
    plotNotes(todisplay)
    
}

savenote.addEventListener('click',async()=>{
    notes = await getNotes()
    notes[opened] = notevalue.value
    await setNotes(notes)
    notevalue.value = ''
    opened = -1
    searchbar.value = ''
    searchnotes()
    editor.style.display = 'none'
    document.getElementById('content').style.display = 'block'
})

cancelnote.addEventListener('click',async()=>{
    notevalue.value = ''
    opened = -1
    editor.style.display = 'none'
    document.getElementById('content').style.display = 'block'
    searchbar.value = ''
    searchnotes()
})


plotNotes()

