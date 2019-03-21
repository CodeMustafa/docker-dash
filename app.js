const express = require('express');
const Docker = require('dockerode');

const app = express();
const port = 3000;

//app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist/'));

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

app.get('/', (req, res) => {
	// filter by labels
	let opts = {
		"limit": 3,
		"filters": '{"label": []}'
	};
	
	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {
		"label": []
	};
	docker.listImages(opts, function(err, images) {
		let images_names = '';
		let images_ids = '';

		images.forEach(function (imageInfo) {
			images_names+='</br>'+imageInfo.RepoTags[0];
			images_ids += '</br>'+imageInfo.Id;
		});
		res.send('No of System Images : ' + images.length + '</br></hr></br> Images Names : ' + images_names +'</br></hr></br> Images Ids : '+images_ids);
	});
});


app.get('/images',(req,res)=>{

	// filter by labels
	let opts = {
		"limit": 3,
		"filters": '{"label": []}'
	};

	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {
		"label": []
	};

	//getting all images in the system
	docker.listImages(opts, function(err, images) {
		console.log(images[0]);
		res.render('images.pug', {image_obj: images});
	});
});

app.listen(port, () => console.log(`Docker-Dash is listening on port ${port}!`));
