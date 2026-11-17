// logic for training classes ===>
document.addEventListener('DOMContentLoaded', function() {
    const classView = document.querySelector('.training-1-view')
    const classDivs = document.querySelectorAll('#class-sideA button')

    //content for each class
    const classContent = {
        firstClass: {
            imageSrc: 'Assets/Images/training-image-01.jpg',
            imgAltText: 'training image 1',
            headerText: 'First Training Class',
            paragraphText: 'Lifting an appropriate amount of weight. Start with a weight you can lift comfortably 12 to 15 times, instructors would be around to guide you. Learn to do each exercise correctly'
        },
        secondClass: {
            imageSrc: 'Assets/Images/training-image-02.jpg',
            imgAltText: 'training image 2',
            headerText: 'Second Training Class',
            paragraphText: 'Yoga is a mind and body practice. Various styles of yoga combines physical postures, breathing techniques, and meditation or relaxation.'
        },
        thirdClass: {
            imageSrc: 'Assets/Images/training-image-03.jpg',
            imgAltText: 'training inage 3',
            headerText: 'Third Training Class',
            paragraphText: "Your induction should include a brief 'how to' for every machine. If there's one that was missed out and you want to use it, don't try to figure it out on your own: ask a staff member to show you how to use it properly."
        },
        fifthClass: {
            imageSrc: 'Assets/Images/training-image-01.jpg',
            imgAltText: 'Strength training equipment',
            headerText: 'Fifth Training Class',
            paragraphText: 'Build on your fitness foundation with advanced strength and endurance training. Bret D. Bowers guides each session with exercises suited to your experience.'
        },
        fourthClass: {
            imageSrc: 'Assets/Images/training-image-04.jpg',
            imgAltText: 'training image 4',
            headerText: 'Fourth Training Class',
            paragraphText: 'Warm ups are crucial as they prepare the body for the demands of exercise, loosening up the muscles and reducing the risk of injury.'
        }
    }

    function renderClassContent(classKey) {

        classView.innerHTML = ''

        //create and append new elements
        const imageElement = document.createElement('img')
        imageElement.src = classContent[classKey].imageSrc
        imageElement.alt = classContent[classKey].imgAltText

        const headerElement = document.createElement('h1')
        headerElement.innerHTML = classContent[classKey].headerText

        const paragraphElement = document.createElement('p')
        paragraphElement.innerHTML = classContent[classKey].paragraphText

        const buttonElement = document.createElement('button')
        buttonElement.textContent = 'VIEW SCHEDULE'
        buttonElement.onclick = function() {
        window.location.href = '#schedules'
    }
       //appending elements to the .training-1-view div
       classView.appendChild(imageElement)
       classView.appendChild(headerElement)
       classView.appendChild(paragraphElement)
       classView.appendChild(buttonElement)
    }
    
    //initial render for first training class
    renderClassContent('firstClass')
    classDivs[0].classList.add('active')

    // adding event listeners to each div inside class-sideA
    classDivs.forEach(classDiv => {
        classDiv.addEventListener('click', function(){
            //removing active class from all divs
            classDivs.forEach(div => {
                div.classList.remove('active')
                div.setAttribute('aria-pressed', 'false')
            })
                //adding active class to the clicked div
                this.classList.add('active')
                this.setAttribute('aria-pressed', 'true')
                //getting the selected class id and rendering the corresponding content
                const selectedClassId = this.id
                renderClassContent(selectedClassId)
        })
    }
    )
})

// logic for schedule table
// Rotate session pairs so each instructor has different times across the week.
const trainingTimeSlots = [
    ['6:00AM - 7:30AM', '1:00PM - 2:30PM'],
    ['7:00AM - 8:30AM', '2:00PM - 3:30PM'],
    ['8:00AM - 9:30AM', '3:00PM - 4:30PM'],
    ['9:00AM - 10:30AM', '4:00PM - 5:30PM'],
    ['10:00AM - 11:30AM', '5:00PM - 6:30PM']
];
const scheduleArrays = Array.from({ length: 5 }, (_, dayIndex) =>
    Object.fromEntries(Array.from({ length: 10 }, (_, index) => [
        `time${index + 1}`,
        trainingTimeSlots[(Math.floor(index / 2) + dayIndex) % trainingTimeSlots.length][index % 2]
    ]))
);

document.addEventListener('DOMContentLoaded', () => {
    populateSchedule(scheduleArrays[0]);

    document.getElementById('mon').addEventListener('click', () => {
        highlightDay('mon');
        populateSchedule(scheduleArrays[0]);
    });

    document.getElementById('tue').addEventListener('click', () => {
        highlightDay('tue');
        populateSchedule(scheduleArrays[1]);
    });

    document.getElementById('wed').addEventListener('click', () => {
        highlightDay('wed');
        populateSchedule(scheduleArrays[2]);
    });

    document.getElementById('thur').addEventListener('click', () => {
        highlightDay('thur');
        populateSchedule(scheduleArrays[3]);
    });

    document.getElementById('fri').addEventListener('click', () => {
        highlightDay('fri');
        populateSchedule(scheduleArrays[4]);
    });

    function highlightDay(day) {
        const days = ['mon', 'tue', 'wed', 'thur', 'fri'];
        days.forEach(d => {
            document.getElementById(d).classList.remove('highlight');
            document.getElementById(d).setAttribute('aria-pressed', String(d === day));
        });
        document.getElementById(day).classList.add('highlight');
        document.getElementById('schedule-caption').textContent = `${document.getElementById(day).textContent} class times`;
    }
    highlightDay('mon')
    
    function populateSchedule(schedule) { // this logic iterates through i and then matches the object in scheduleArrays to the id of the
        for (let i = 1; i <= 10; i++) {   // <td></td> in my DOM
            if (schedule[`time${i}`]) {
                document.getElementById(`td-${i}`).textContent = schedule[`time${i}`];
            } else {
                document.getElementById(`td-${i}`).textContent = '';
            }
        }
    }
});

//logic for map
function handleMap() {
    var map = L.map('map', {
        center: [7.3776, 3.9059],
        zoom: 13,
        dragging: false,
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
      });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    var marker = L.marker([7.3776, 3.9059]).addTo(map)
        .bindPopup('Hover over the map to see the coordinates.');

        var hoveringEnabled = true;

        function onMouseMove(e) {
          if (hoveringEnabled) {
            var lat = e.latlng.lat.toFixed(4);
            var lng = e.latlng.lng.toFixed(4);
            marker.setLatLng(e.latlng)
              .getPopup()
              .setContent('Coordinates: ' + lat + ', ' + lng)
              .openOn(map);
          }
        }
  
        map.on('mousemove', onMouseMove);
  
        map.on('dblclick', function() {
          hoveringEnabled = !hoveringEnabled;
          if (!hoveringEnabled) {
            map.off('mousemove', onMouseMove);
        } else {
          map.on('mousemove', onMouseMove);
        }
      });
}
if (typeof L !== 'undefined') handleMap()
