function switchToProject(target)
	{
	fixProjects();
	currentProject = Math.min(target, projects.length - 1);
	updateProjects();
	}

function fixProjects()
	{
	if (window.projects === undefined) 
		if (!loadProjectsFromLocalStorage())
			projects = [JSON.parse(newProject)];
	if (projects === null) 
		if (!loadProjectsFromLocalStorage())
			projects = [JSON.parse(newProject)];
	if (window.currentProject === undefined || currentProject === null)
		currentProject = 0;
	if (projects[currentProject] === undefined || projects[currentProject] === null)
		currentProject = 0;
	if (projects[currentProject] === undefined || projects[currentProject] === null)
		projects[currentProject] = JSON.parse(newProject);
	}

function loadProjectsFromLocalStorage()
	{
	var tempProjects = localStorage.getItem("projects");
	if (tempProjects === null) return false;
	projects = JSON.parse(tempProjects);
	updatetabsif(0);
	updatetemplatesif(0);
	return true;
	}

function storeProjectsToLocalStorage()
	{
	fixProjects();
	if (mode == 1)
		projects[currentProject].commands[projects[currentProject].currentCommand].input = document.getElementById("wordInput").value;
	localStorage.setItem("projects", JSON.stringify(projects));
	document.title = "Tempsaved!";
	setTimeout(endAutoSaveAlert , 1000);
	}

function endAutoSaveAlert()
	{
	document.title = windowTitle;
	}

function addANewProject(projectToBeAdded)
	{
	fixProjects();
	newTab = projects.length;
	if (projectToBeAdded === undefined || projectToBeAdded === null)
		projects[newTab] = JSON.parse(newProject);
	else
		{
		try 
			{
			projects[newTab] = JSON.parse(projectToBeAdded);
			}
		catch(e) 
			{
			alert("Error: file seems corrupted or it's not a Conlangjugator project!");
			}
		}
	updateProjects();
	switchToProject(newTab);
	}

function updateProjects()
	{
	fixProjects();
	let i = 0;
	let code = "";
	for (i = 0; i < projects.length; i++)
		{
		if (i == currentProject)
			code += interfacebuttonbold(projects[i].name, 'switchToProject(' + i + ')', 'proj' + i);
		else
			code += interfacebutton(projects[i].name, 'switchToProject(' + i + ')','proj' + i);
		}
	code += interfacebutton('+', 'addANewProject()');
	document.getElementById("projectsid").innerHTML = code;
	currentProject = Math.min(currentProject, projects.length - 1);
	updateTabs();
	updateTemplates();
	}

function deleteCurrentProject()
	{
	fixProjects();
	if (confirm("Are you sure you want to delete the current project?\nThis action cannot be undone!"))
		{
		projects.splice(currentProject, 1);
		updateProjects();
		}
	}

function saveCurrentProject()
	{
	fixProjects();
	var saveText = JSON.stringify(projects[currentProject]);
	var blob = new Blob([saveText], {type: "text/plain;charset=utf-8"});
	saveAs(blob, projects[currentProject].name + ".clj");
	}

function renameProject()
	{
	fixProjects();
	let newName = prompt("Enter new project name:", projects[currentProject].name);
	changeProjectName(newName);
	}

function closeProject()
	{
	fixProjects();
	let doClose = true;
	if (warningOnProjectClose)
		if (!confirm("Are you sure you want to close project " + projects[currentProject].name+"?"))
			doClose = false;
	if (doClose)
		projects.splice(currentProject, 1);
	updateProjects();
	}

function openProject()
	{
	let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.onchange = function(e)
        	{
		let files = e.target.files;
		if (files.length < 1)
			{
			alert('select a file...');
			return;
			}
		let reader = new FileReader();
		reader.onload = function(e)
			{
			let match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
			if (match == null)
				{
				throw 'Could not parse result'; // should not happen
				}
			addANewProject(base64Decode(match[2]));
			};
		reader.readAsDataURL(files[0]);
		}
        input.click();
        input.outerHTML = "";
	}

function base64Decode(str, encoding = 'utf-8')
	{
	let bytes = base64js.toByteArray(str);
	return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
	}

function changeProjectName(newName)
	{
	if (newName === undefined)
		return 1;
	if (newName === null)
		return 2;
	fixProjects();
	let i = 0;
	for (i = 0; i < projects.length; i++)
		if (projects[i] !== null && projects[i] !== undefined)
			if (i != currentProject)
				if (projects[i].name == newName) 
					{
					return 3;
					}
	projects[currentProject].name = newName;
	updateProjects();
	}
