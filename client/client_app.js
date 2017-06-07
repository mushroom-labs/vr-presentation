class ClientApp {
    constructor(items) {
        this._items = items;
        this._currentItemIndex = NaN;
    }

    setCurrentItem(index) {
        if ((index < 0) || (index >= this._items.length)) {
            return;
        }
        if (index == this._currentItemIndex) {
            return
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
    constructor(ioClient, items) {
        super(items);        
        this._currentItemIndex = 0;
        this._ioClient = ioClient;
        //TODO
    }

    _onCurrentItemChanged(itemIndex) {
        this._ioClient.emit("active_item_changed", itemIndex);
    }

    _invalidateItemView(itemIndex) {
        //TODO
        console.log(this._items[itemIndex]);
    }

    next() {
        this.setCurrentItem(this._currentItemIndex + 1);
    }

    prev() {
        this.setCurrentItem(this._currentItemIndex - 1);
    }
}

class SlaveClientApp extends ClientApp {
    constructor(ioClient, items) {
        super(items);
        ioClient.on("show_item", (itemIndex => {
            this.setCurrentItem(itemIndex);
        }));
        //TODO
    }

    _onCurrentItemChanged(itemIndex) {
        //DO NOTHING
    }

    _invalidateItemView(itemIndex) {
        //TODO
        console.log(this._items[itemIndex]);
    }
}