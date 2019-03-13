const express = require('express');
const Docker = require('dockerode');

const app = express();
const port = 3000;

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

app.get('/', (req, res) => {
	// filter by labels
	var opts = {
		"limit": 3,
		"filters": '{"label": []}'
	};
	
	// maps are also supported (** requires docker-modem 0.3+ **)
	opts["filters"] = {
		"label": []
	};
	docker.listImages(opts, function(err, images) {
		var images_names = '';
		var images_ids = '';

		images.forEach(function (imageInfo) {
			images_names+='</br>'+imageInfo.RepoTags[0];
			images_ids += '</br>'+imageInfo.Id;
		});
		res.send('No of System Images : ' + images.length + '</br></hr></br> Images Names : ' + images_names +'</br></hr></br> Images Ids : '+images_ids);
	});
});

app.listen(port, () => console.log(`Docker-Dash is listening on port ${port}!`));
