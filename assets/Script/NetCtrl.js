var NetCtrl = {
    _socket:null,
    dataEventHandler:null,
    setHandler(dataEventHandler){
        this.dataEventHandler = dataEventHandler;
    },
    fire(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }
    },
    clearSocketBind(){
        if(this._socket){
            this._socket.onopen = undefined;
            this._socket.onmessage = undefined;
            this._socket.onclose = undefined;
            this._socket.onerror = undefined;
        }
    },
    connect(host,port){
        if(this.isOpen()){
            cc.log("websocket is open,no need create new!");
            return;
        }
        this.clearSocketBind();
        this._socket = new WebSocket("ws://"+host+":"+port,"xujialong");
        this._socket.onopen = ()=>{
            this._onOpen();
        }
        this._socket.onmessage=(event)=>{
            this._onMessage(event);
        }
        this._socket.onclose=()=>{
            this._onClose();
        }
    },
    close(){
        if(this._socket){
            this.clearSocketBind();
            this._socket.close();
        }
    },
    _onOpen(){
        cc.log("socket open");
        this.fire("websocket_open",null);
    },
    _onClose(){
        cc.log("socket close");
        this.fire("websocket_close",null);
    },
    _onMessage(obj){
        this.fire('websocket_message',obj.data);
    },
    send(obj){
       let str = JSON.stringify(obj)
       if (this.isOpen()){
        cc.log("CLIENT:"+str)
        this._socket.send(str);
       }
       
    },
    sendMsg(mainID,subID,obj){
        if (typeof(obj) === 'undefined'){
            obj = {};
        }
        obj.mainID = mainID
        obj.subID = subID
        this.send(obj)
    },
    isOpen(){
        return (this._socket&&this._socket.readyState===WebSocket.OPEN);
    }
};

module.exports = NetCtrl;