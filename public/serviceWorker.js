const cacheName = "whatsupmessaging";
const files = [
	"./",
	"./index.html",
	"./firebase-messaging-sw.js",
	"./js/index.js",
	"./css/index.css",
	"./assets/back.png",
	"./assets/close.png",
	"./assets/edit.png",
	"./assets/leave.png",
	"./assets/new-chat.png",
	"./assets/send.png",
	"./assets/settings.png",
	"./assets/upload-image.png",
];

self.addEventListener("install", (e) => {
	e.waitUntil(async () => {
		const cache = await caches.open(cacheName);
		await cache.addAll(files);
	});
});

self.addEventListener("fetch", (event) => {
	if (event.request.method != "POST" && event.request.destination != "video") {
		event.respondWith(fromCache(event.request.clone()));
		event.waitUntil(update(event.request.clone()));
	}
});

function fromCache(request) {
	return caches
		.open(cacheName)
		.then((cache) => {
			return cache
				.match(request)
				.then((matching) => {
					return (
						matching ||
						fetch(request)
							.catch((err) => {
								console.log(err);
								console.log(request);
							})
							.catch((err) => {
								console.log(err);
								console.log(request);
							})
					);
				})
				.catch((err) => {
					console.log(err);
					console.log(request);
				});
		})
		.catch((err) => {
			console.log(err);
			console.log(request);
		});
}

function update(request) {
	return caches
		.open(cacheName)
		.then((cache) => {
			return fetch(request)
				.then((response) => {
					return cache.put(request, response);
				})
				.catch((err) => {
					console.log(err);
					console.log(request);
				});
		})
		.catch((err) => {
			console.log(err);
			console.log(request);
		});
}
