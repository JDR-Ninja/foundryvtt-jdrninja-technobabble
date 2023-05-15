class Technobabble {
	static isWaiting = false;
	static lastCall = 0;

	static async Init(controls, html) {

		const technobabblebtn = $(`<li class="scene-control technobabble-scene-control" data-control="technobabble" title="Technobabble"><i class="fas fa-industry-alt"></i></li>`);

		const technobabbleControls = $(`<ol class="sub-controls app control-tools technobabble-sub-controls flexcol"></ol>`);

		const computersBtn = $(`<li class="control-tool" data-tool="select" data-tooltip="Informatiques"><i class="fas fa-tv-retro"></i></li>`);
		const reactorsBtn = $(`<li class="control-tool" data-tool="select" data-tooltip="Réacteurs"><i class="fal fa-atom-alt"></i></li>`);
		const componentsBtn = $(`<li class="control-tool" data-tool="select" data-tooltip="Composantes"><i class="far fa-project-diagram"></i></li>`);

		html.find(".main-controls").append(technobabblebtn);

		technobabbleControls.append(computersBtn);
		technobabbleControls.append(reactorsBtn);
		technobabbleControls.append(componentsBtn);
		html.append(technobabbleControls);

		technobabblebtn[0].addEventListener('click', event => {
			if (!canvas.ready) return;

			if (html.find('.technobabble-scene-control').hasClass('active')) {
				html.find('.technobabble-scene-control').removeClass('active');
				html.find('.technobabble-sub-controls').removeClass('active');
				html.find('.scene-control').first().addClass('active');
				
			} else {
				html.find('.scene-control').removeClass('active');
				html.find('.sub-controls').removeClass('active');

				html.find('.technobabble-scene-control').addClass('active');
				html.find('.technobabble-sub-controls').addClass('active');
				
			}

			event.stopPropagation();
		});

		computersBtn[0].addEventListener('click', ev => this._generatorClick(computersBtn, 'Computers'));
		reactorsBtn[0].addEventListener('click', ev => this._generatorClick(reactorsBtn, 'Reactors'));
		componentsBtn[0].addEventListener('click', ev => this._generatorClick(componentsBtn, 'Components'));
	}

	static async _generatorClick(control, url) {
		const currentTime = Date.now();
		if (Technobabble.isWaiting || (currentTime - Technobabble.lastClickTime) < 2000) {
			return;
		}

		Technobabble.isWaiting = true;

		try {
			Technobabble.lastClickTime = currentTime;
			let data = await this._doAjaxGet(url);

			let chatData = {
				user: game.user._id,
				speaker: ChatMessage.getSpeaker(),
				content: data + `<div class="technobabble-footer"><i class="` + control.find("i").attr("class") + `"></i> Technobabble généré par <a href="https://www.jdr.ninja/Technobabble?ref=foundryvtt">JDR.Ninja</a></div>`
			};

			return ChatMessage.create(chatData, {});
		}
		finally {
			Technobabble.isWaiting = false;
		}
	}

	static _doAjaxGet(url) {
		// https://www.reddit.com/r/FoundryVTT/comments/tvwyf0/for_the_plugin_makers_chartopia_api_for_random/
		const xhr = new XMLHttpRequest();
		const p = new Promise((resolve, reject) => {
			xhr.open("POST", `https://www.jdr.ninja/TechnobabbleAPI/`.concat(url), true);

			xhr.onload = function () {
				resolve(this.response);
			};

			xhr.onerror = (e) => reject(new Error(`Error during request: ${e}`));

			xhr.send();
		});

		p.abort = () => xhr.abort();

		return p;
	}
}

Hooks.on('renderSceneControls', (controls, html) => {
	Technobabble.Init(controls, html);
});