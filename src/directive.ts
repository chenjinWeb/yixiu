export default function (Vue: any) {
	Vue.directive('touch-event', {
		bind: (el: any, binding: any, vnode: any) => {
			if (!(typeof binding.value === 'function')) {
				return;
			}
			const p: any = {
				endTime: 0,
				startTime: 0
			};
			el.addEventListener('touchstart', (event: any) => {
				const e = event.changedTouches[0];
				if (!e) {
					return;
				}
				p.startTime = event.timeStamp;
				p.startX = e.clientX;
				p.startY = e.clientY;
				p.type = 'start';
				binding.value(position(p));
			}, false);
			el.addEventListener('touchmove', (event: any) => {
				const e = event.changedTouches[0];
				if (!e) {
					return;
				}
				p.endTime = event.timeStamp;
				p.x = e.clientX;
				p.y = e.clientY;
				p.type = 'move';
				binding.value(position(p));
				p.startX = e.clientX;
				p.startY = e.clientY;
			}, false);
			el.addEventListener('touchend', (event: any) => {
				const e = event.changedTouches[0];
				if (!e) {
					return;
				}
				p.endTime = event.timeStamp;
				p.type = 'end';
				binding.value(position(p));
			}, false);
		}
	});

  /**
   * <div v-ripple></div>
   */
	Vue.directive('ripple', {
		inserted: (el: any, binding: any, vnode: any) => {
			const duration = 450;
			el.addEventListener('touchstart', (event: any) => {
				event.stopPropagation();
				const containerRect = el.getBoundingClientRect();
				const x = event.touches[0].clientX;
				const y = event.touches[0].clientY;
				const radius = distanceToFurthestCorner(x, y, containerRect);
				const offsetX = x - containerRect.left;
				const offsetY = y - containerRect.top;

				const rippleBox = document.createElement('div');
				rippleBox.style.width = `${el.clientWidth}px`;
				rippleBox.style.height = `${el.clientHeight}px`;
				rippleBox.style.overflow = 'hidden';
				rippleBox.style.position = 'absolute';
				// rippleBox.style.zIndex = `-1`;
				el.style.contain = 'content style';

				rippleBox.style.top = `${0}px`;
				rippleBox.style.left = `${0}px`;

				const ripple = document.createElement('div');
				ripple.classList.add('ripple');
				ripple.style.left = `${offsetX - radius}px`;
				ripple.style.top = `${offsetY - radius}px`;
				ripple.style.height = `${radius * 2}px`;
				ripple.style.width = `${radius * 2}px`;
				ripple.style.backgroundColor = 'rgba(0,0,0,.1)'
				ripple.style.transitionDuration = `${duration}ms`;
				rippleBox.appendChild(ripple);
				el.appendChild(rippleBox);
				enforceStyleRecalculation(ripple);
				ripple.style.transform = 'scale(1)';
				setTimeout(() => {
					ripple.style.opacity = `0`;
					~function (_rippleBox) {
						setTimeout(() => {
							el.removeChild(_rippleBox);
						}, duration);
					}(rippleBox);
				}, duration);
			});
		}
	});

	Vue.directive('drag',{
		inserted:(el: HTMLDivElement, binding: any, vnode: any)=> {
			let startX = 0
			let startY = 0
			let top = 0;
			let left = 0;
			let width = 0;
			let height = 0;

			el.addEventListener('touchstart',(event: TouchEvent) => {
				event.stopPropagation();
				let bcrt = el.getBoundingClientRect()

				top = bcrt.top
				left = bcrt.left
				width = bcrt.width
				height = bcrt.height

				let {clientX, clientY} = event.touches[0]
				startX = clientX
				startY = clientY
			})
			el.addEventListener('touchmove',(event: TouchEvent) => {
				event.stopPropagation();
				event.preventDefault();
				let {clientX, clientY} = event.touches[0];

				let y = clientY + (left - startX)
				let x = clientX + (top - startY)
				if(y > window.screen.height - height){
					y = window.screen.height - height
				}
				if(x > window.screen.width - width){
					x = window.screen.width - width
				}
				if(y < 0) y = 0;
				if(x < 0) x = 0;

				el.style.top = `${y}px`;
				el.style.left = `${x}px`;
			})
			el.addEventListener('touchend',(event: TouchEvent) => {
				event.stopPropagation();
			})
		}
	})
}

// ripple
function distanceToFurthestCorner(x: any, y: any, rect: any) {
	const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
	const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
	return Math.sqrt(distX * distX + distY * distY);
}

// ripple
function enforceStyleRecalculation(element: any) {
	window.getComputedStyle(element).getPropertyValue('opacity');
}
function position(p: any) {
	const time: any = parseInt(`${p.endTime - p.startTime}`, 10);
	const y = p.y - p.startY;
	const x = p.x - p.startX;
	return {
		type: p.type,
		time,
		position: {
			x,
			y
		}
	};
}
