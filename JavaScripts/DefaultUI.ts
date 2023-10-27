@UIBind('')
export default class DefaultUI extends UIScript {
	private character: Character;
	private anim1 = null;

	/**  */
	protected onStart() {
		//onUpdate
		this.canUpdate = true;

		//
		const jumpBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Jump') as Button
		const attackBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Attack') as Button


		//,
		jumpBtn.onPressed.add(() => {
			if (this.character) {
				this.character.jump();
			} else {
				Player.asyncGetLocalPlayer().then((player) => {
					this.character = player.character;
					//
					this.character.jump();
				});
			}
		})


		//,
		attackBtn.onPressed.add(() => {
			Player.asyncGetLocalPlayer().then((player) => {
				this.character = player.character;
				AssetUtil.asyncDownloadAsset("61245").then((res: boolean) => {
					if (res) {
						if (!this.anim1) {
							this.anim1 = player.character.loadAnimation("61245");
							this.anim1.slot = AnimSlot.Upper;
						}
						//
						if (this.anim1.isPlaying) {
							return
						} else {
							this.anim1.play();
						}
					}
				})
			});
		})
	}

	/** 
	 * UIonStart 
	 * UI
	 * 
	 */
	protected onAdded() {


	}

	/** 
	 * UIonAdded
	 * UI
	 * 
	 */
	protected onRemoved() {
	}

	/** 
	* UIUI 
	* UIUI
	*/
	protected onDestroy() {
	}

	/**
	* 
	* canUpdate
	* dt 
	*/
	protected onUpdate(dt: number) {

		// update position on each tick
		const myself = Player.localPlayer

		const pos_X = this.uiWidgetBase.findChildByPath("RootCanvas/X") as TextBlock;
		const pos_Y = this.uiWidgetBase.findChildByPath("RootCanvas/Y") as TextBlock;
		const pos_Z = this.uiWidgetBase.findChildByPath("RootCanvas/Z") as TextBlock;


		pos_X.text = `X: ${Math.floor(myself.character.localTransform.position.x)}`
		pos_Y.text = `Y: ${Math.floor(myself.character.localTransform.position.y)}`
		pos_Z.text = `Z: ${Math.floor(myself.character.localTransform.position.z)}`
	}

	/**
	 * 
	 */
	//protected onShow(...params:any[]) {
	//}

	/**
	 * 
	 */
	//protected onHide() {
	//}

	/**
	 * UI
	 * Touch
	 * 
	 * UITouchMoveEnd
	 * UITouchMoveEnd
	 */
	//protected onTouchStarted(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * UI
	 */
	//protected onTouchMoved(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * UI
	 */
	//protected OnTouchEnded(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * UIdetectDrag/detectDragIfPressed
	 * 
	 *  newDragDrop
	 */
	//protected onDragDetected(InGemotry :Geometry,InPointerEvent:PointerEvent):DragDropOperation {
	//	return this.newDragDrop(null);
	//}

	/**
	 * UI
	 * trueUIUI
	 */
	//protected onDragOver(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * UI
	 * trueUIUI
	 */
	//protected onDrop(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * UI
	 */
	//protected onDragEnter(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation) {
	//}

	/**
	 * UI
	 */
	//protected onDragLeave(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
	//}

	/**
	 * 
	 */
	//protected onDragCancelled(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
	//}

}
