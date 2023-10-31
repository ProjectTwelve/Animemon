
/** 
 * AUTHOR: gf4
 * TIME: 2023.11.01-00.04.01
 * ATTENTION: onStart UI
 */

import { MudModule } from "../mud";
import Encounter_Generate from "../ui-generate/Encounter_generate";

export class EncounterUI extends Encounter_Generate {

	mud: MudModule;

	alertTxt: TextBlock;

	/** 
	 * UI 
	 */
	protected onStart() {
		//onUpdate
		this.canUpdate = false;
		this.layer = UILayerMiddle;
		this.mud = MudModule.getInstance();

		const { systemCalls: { throwBall, fleeEncounter } } = this.mud;

		const ThrowBallBtn = this.uiWidgetBase.findChildByPath("RootCanvas/ThrowBall") as Button;
		const FleeBtn = this.uiWidgetBase.findChildByPath("RootCanvas/Flee") as Button
		this.alertTxt = this.uiWidgetBase.findChildByPath("RootCanvas/Alert") as TextBlock;


		this.alertTxt.text = ""


		ThrowBallBtn.onClicked.add(() => {
			this.alertTxt.text = ""
			throwBall().then((result) => {
				console.log("result: ", result)
				const resultTextMap = {
					0: "Missed",
					1: "Monster Caught",
					2: "Monster Fled"
				}
				this.alertTxt.text = resultTextMap[result]

			});
		})

		FleeBtn.onClicked.add(() => {
			this.alertTxt.text = ""

			fleeEncounter().then(() => {
				this.alertTxt.text = "You Flee"
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

		this.alertTxt.text = ""

	}

	/**
	* 
	* canUpdate
	* dt 
	*/
	//protected onUpdate(dt :number) {
	//}

	/**
	 * 
	 */
	protected onShow(...params: any[]) {


	}

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
	//protected onTouchStarted(InGeometry :mw.Geometry,InPointerEvent:mw.PointerEvent) :mw.EventReply{
	//	return mw.EventReply.unHandled; //mw.EventReply.handled
	//}

	/**
	 * UI
	 */
	//protected onTouchMoved(InGeometry :mw.Geometry,InPointerEvent:mw.PointerEvent) :mw.EventReply{
	//	return mw.EventReply.unHandled; //mw.EventReply.handled
	//}

	/**
	 * UI
	 */
	//protected onTouchEnded(InGeometry :mw.Geometry,InPointerEvent:mw.PointerEvent) :mw.EventReply{
	//	return mw.EventReply.unHandled; //mw.EventReply.handled
	//}

	/**
	 * UIdetectDrag/detectDragIfPressed
	 * 
	 *  newDragDrop
	 */
	//protected onDragDetected(InGeometry :mw.Geometry,InPointerEvent:mw.PointerEvent):mw.DragDropOperation {
	//	return this.newDragDrop(null);
	//}

	/**
	 * UI
	 * trueUIUI
	 */
	//protected onDragOver(InGeometry :mw.Geometry,InDragDropEvent:mw.PointerEvent,InDragDropOperation:mw.DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * UI
	 * trueUIUI
	 */
	//protected onDrop(InGeometry :mw.Geometry,InDragDropEvent:mw.PointerEvent,InDragDropOperation:mw.DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * UI
	 */
	//protected onDragEnter(InGeometry :mw.Geometry,InDragDropEvent:mw.PointerEvent,InDragDropOperation:mw.DragDropOperation) {
	//}

	/**
	 * UI
	 */
	//protected onDragLeave(InDragDropEvent:mw.PointerEvent,InDragDropOperation:mw.DragDropOperation) {
	//}

	/**
	 * 
	 */
	//protected onDragCancelled(InDragDropEvent:mw.PointerEvent,InDragDropOperation:mw.DragDropOperation) {
	//}

}
