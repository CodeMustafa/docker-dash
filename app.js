const express = require('express');
const Docker = require('dockerode');

const app = express();
const port = 3000;

//app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('node_modules/jquery/dist/'));
app.use(express.static('node_modules/bootstrap/dist/'));
app.use(express.static('node_modules/font-awesome/css/'));
app.use(express.static('node_modules/font-awesome/'));

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

app.get('/', (req, res) => {
	res.render('index',{title:'Index'});
});


app.get('/images',(req,res)=>{

	// filter by labels
	let opts = {"limit": 3,"filters": '{"label": []}'};
	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {"label": []};

	//getting all images in the system
	docker.listImages(opts, function(err, images) {
		res.render('images', {image_obj: images,title:'images'});
	});
});

app.get('/containers',(req,res)=>{

	// filter by labels
	let opts = {"limit": 100,"filters": '{"label": []}'};
	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {"label": []};

	//getting all images in the system
	docker.listContainers(opts, function(err, containers) {
		res.render('container', {container_obj: containers,title:'Containers'});
	});
});

app.get('/containers/:Id', function(req, res) {
	//res.send('What is up ' + req.Id + '!');
	// filter by labels
	let opts = {"limit": 100,"filters": '{"label": []}'};
	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {"label": []};

	//getting all images in the system
	docker.listContainers(opts, function(err, containers) {
		//console.log(containers[0].Names[0].eq(req.params.id));
		let conainer = containers.filter(r => r.Names[0].replace("/","") === req.params.Id);
		res.render('container_details', {network_obj: conainer[0]//containers[temp]
			,title:'Container Details'});
	});
});

app.get("/projects",function(req,res){
	let projects = [{
		name:"test",
		Id:"23454"
	}];

	res.render("projects",{projects:projects});
});

app.get("/projects/create",(req,res)=>{
	res.render("projects_create");
});

app.post("/projects/create",(req,res)=>{
	res.redirect("/projects/");
});

app.post("/projects/delete/:Id",(req,res)=>{
	res.send("delete project");

	res.redirect("/projects/");
});

app.listen(port, () => console.log(`Docker-Dash is listening on port ${port}!`));
