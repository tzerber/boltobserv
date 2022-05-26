// Smoke rendering
//
// Shows smokes on map an calculates duration.

// The live position of all smokes
socket.element.addEventListener("smokes", event => {
	let smokes = event.data

	// Called to show the fade in animation with a delay
	function fadeIn(smokeElement, team) {
		setTimeout(() => {
			smokeElement.className = "smokeEntity show " + team
		}, 25)
	}

	// Called to remove the smoke element after the fadeout
	function remove(smokeElement) {
		setTimeout(() => {
			smokeElement.outerHTML = ""
		}, 2000)
	}

	// Go through each smoke
	for (let smoke of smokes) {
		// Get the smoke element
		let smokeElement = document.getElementById("smoke" + smoke.id)

		let team = "U"
		if (global.config.radar.smokeColors) team = smoke.team

		// If the element does not exist yet, add it
		if (!smokeElement) {
			// Create a new element
			smokeElement = document.createElement("div")
			smokeElement.id = "smoke" + smoke.id
			smokeElement.className = "smokeEntity hide" + team

			// Calculate the height and width based on the map resolution
			smokeElement.style.height = smokeElement.style.width = 290 / global.mapData.resolution / 1024 * 100 + "%"

			// Add it to the DOM
			document.getElementById("smokes").appendChild(smokeElement)

			// Play the fade in animation
			fadeIn(smokeElement, team)

			// Set the location of the smoke
			smokeElement.style.left = global.positionToPerc(smoke.position, "x") + "%"
			smokeElement.style.bottom = global.positionToPerc(smoke.position, "y") + "%"
		}

		// If the smoke has been here for over 15 seconds, ready the smoke element for the fade away
		// Setting the fading class will set the opacity transition to another value
		if (smoke.time > 15 && smoke.time <= 16.4 && smokeElement.className != "smokeEntity fading " + team) {
			smokeElement.className = "smokeEntity fading " + team
		}

		// Trigger the fade away
		if (smoke.time > 16.4 && smokeElement.className != "smokeEntity fading hide " + team) {
			smokeElement.className = "smokeEntity fading hide " + team
			remove(smokeElement)
		}
	}
})

// The position of all infernos
socket.element.addEventListener("infernos", event => {
	let infernos = event.data

	// Go through each inferno
	for (let inferno of infernos) {
		// Get the inferno element
		let infernoElement = document.getElementById("inferno" + inferno.id)
		let flameElementsStr = ""
		let flameElement = []

		// If the element does not exist yet, add it
		if (!infernoElement) {
			infernoElement = document.createElement("div")

			infernoElement.id = "inferno" + inferno.id
			infernoElement.className = "inferno"
			infernoElement.style.opacity = 1

			// Add it to the inferno container
			document.getElementById("infernos").appendChild(infernoElement)
		}

		// For each flame in the inferno
		for (var i = 0; i < inferno.flamesNum; i++) {
			// Create a new flame
			flameElement[i] = document.createElement("div")

			// Style the flame
			flameElement[i].style.height = flameElement[i].style.width = 100 / global.mapData.resolution / 1024 * 100 + "%"
			flameElement[i].style.left = global.positionToPerc(inferno.flamesPosition[i], "x") + "%"
			flameElement[i].style.bottom = global.positionToPerc(inferno.flamesPosition[i], "y")  + "%"

			// Add it to the parent inferno
			flameElementsStr += flameElement[i].outerHTML
		}

		// SHow the new inferno elements
		infernoElement.innerHTML = flameElementsStr
	}
})

// Remove inferno when burned out
socket.element.addEventListener("infernoRemove", event => {
	if (document.getElementById("inferno" + event.data)) {
		document.getElementById("inferno" + event.data).style.opacity = 0
	}
})

// The live position of all flashbangs
socket.element.addEventListener("flashbangs", event => {
	let flashbangs = event.data

	// Called to show the fade in animation with a delay
	function fadeIn(flashbangElement) {
		setTimeout(() => {
			flashbangElement.className = "flashbangEntity show"
		}, 25)
	}

	// Go through each flashbang
	for (let flashbang of flashbangs) {
		// Get the flashbang element
		let flashbangElement = document.getElementById("flashbang" + flashbang.id)

		// If the element does not exist yet, add it
		if (!flashbangElement) {
			// Create a new element
			flashbangElement = document.createElement("div")
			flashbangElement.id = "flashbang" + flashbang.id
			flashbangElement.className = "flashbangEntity hide"

			// Calculate the height and width based on the map resolution
			flashbangElement.style.height = flashbangElement.style.width = 290 / global.mapData.resolution / 1024 * 100 + "%"

			// Add it to the DOM
			document.getElementById("flashbangs").appendChild(flashbangElement)

			// Play the fade in animation
			fadeIn(flashbangElement)

			// Set the location of the flashbang
			flashbangElement.style.left = global.positionToPerc(flashbang.position, "x") + "%"
			flashbangElement.style.bottom = global.positionToPerc(flashbang.position, "y") + "%"
		}
	}
})

socket.element.addEventListener("flashbangRemove", event => {
	if (document.getElementById("flashbang" + event.data)) {
		document.getElementById("flashbang" + event.data).style.opacity = 0
	}
})

// Clear all smokes and inmernos on round reset
socket.element.addEventListener("roundend", event => {
	document.getElementById("smokes").innerHTML = ""
	document.getElementById("infernos").innerHTML = ""
	document.getElementById("flashbangs").innerHTML = ""
})
