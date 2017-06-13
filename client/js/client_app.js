class ClientApp {
    constructor(appConfig) {
        this._client = appConfig.client;
        this._presentation = appConfig.presentation;
        this._titleView = appConfig.titleView;
        this._slidesCounterView = appConfig.slidesCounterView;
        this._slidesContainerView = appConfig.slidesContainerView;

        this._currentItemIndex = NaN;
    }

    setCurrentItem(index) {
        const items = this._presentation.slides;
        if ((index < 0) || (index >= items.length)) {
            return;
        }
        if (index == this._currentItemIndex) {
            return;
        }

        this._currentItemIndex = index;
        this._onCurrentItemChanged(this._currentItemIndex);
        this._invalidateItemView(this._currentItemIndex);
    }

    _onCurrentItemChanged(itemIndex) {
        //abstract
    }

    _invalidateItemView(itemIndex) {
        //abstract
    }
}

class MasterClientApp extends ClientApp {

    constructor(appConfig) {
        super(appConfig);
        this._nextButtonView = appConfig.nextButtonView;
        this._prevButtonView = appConfig.prevButtonView;
        this._nextButtonView.addEventListener("click", () => this.next());
        this._prevButtonView.addEventListener("click", () => this.prev());
        this._titleView.innerText = this._presentation.title;
        this.setCurrentItem(0);
    }

    _onCurrentItemChanged(itemIndex) {
        this._client.emit("active_item_changed", itemIndex);
    }

    _invalidateItemView(itemIndex) {
        const item = this._presentation.slides[itemIndex];
        this._slidesContainerView.style = `background-image: url("${item.data.blob}");`;
        this._slidesCounterView.innerText = itemIndex;
    }

    next() {
        this.setCurrentItem(this._currentItemIndex + 1);
    }

    prev() {
        this.setCurrentItem(this._currentItemIndex - 1);
    }
}

class SlaveClientApp extends ClientApp {
    constructor(appConfig) {
        super(appConfig);
        this._maxWidth = this._slidesContainerView.getAttribute("width");
        this._maxHeight = this._slidesContainerView.getAttribute("height");
        ioClient.on("show_item", (itemIndex => {
            this.setCurrentItem(itemIndex);
        }));
    }

    _onCurrentItemChanged(itemIndex) {
    }

    _invalidateItemView(itemIndex) {
        const slideData = this._presentation.slides[itemIndex].data;
        const scale = Math.min(this._maxWidth / slideData.width, this._maxHeight / slideData.height);
        this._slidesContainerView.setAttribute("src", slideData.blob);
        this._slidesContainerView.setAttribute("width", slideData.width * scale);
        this._slidesContainerView.setAttribute("height", slideData.height * scale);
    }
}