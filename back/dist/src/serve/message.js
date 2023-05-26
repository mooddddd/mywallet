"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_interface_1 = require("@core/transaction/transaction.interface");
const block_interface_1 = require("@core/block/block.interface");
class Message {
    constructor(blockChain) {
        this.blockChain = blockChain;
    }
    handler(type, payload) {
        try {
            // 받는 인자값(타입)에 따라 페이로드를 넘겨줌.
            const message = this[type](payload);
            // this.latestBlock(payload) 이런 형태로 코드가 실행됨
            return message;
        }
        catch (e) {
            return;
        }
    }
    // 받은 페이로드에 따라 실행되는 메서드들! 서버의 입장에서 실행된다.
    latestBlock(payload) {
        // 먼저 연결하는 쪽(클라이언트)이 빈 객체를 보내면 그 다음으로 이 메서드 실행됨!
        console.log("latestBlock Method");
        return this.getAllBlockMessage();
    }
    allBlock(payload) {
        console.log("allBlock Method");
        // payload는 최신블럭 형태로 오기 때문에 배열이거나 트랜잭션이면 리턴
        if (Array.isArray(payload))
            return;
        if (payload instanceof transaction_interface_1.TransactionRow)
            return;
        // 최신블럭이 왔다면 블럭을 체인에 추가! 잘 되었으면 리턴
        const result = this.blockChain.addBlockInChain(payload);
        if (result)
            return;
        // 만약 온 블럭이 최신블럭이 아니라면
        return this.getReceivedChainMessage();
    }
    receivedChain(payload) {
        console.log(`message: received Chain`);
        if (!Array.isArray(payload))
            return;
        this.blockChain.replaceChain(payload);
    }
    receivedTransaction(payload) {
        if (Array.isArray(payload))
            return;
        if (payload instanceof block_interface_1.IBlock)
            return;
        console.log(`receivedTx: 트랜잭션 내용이 추가되었습니다. Peer들에게 전달합니다.`);
        this.blockChain.replaceTransaction(payload);
        return this.getReceivedTransactionMessage(payload);
    }
    // 위에 있는 Private 메서드들 중 어느것이 쓰였는지 메세지를 날려주는 역할
    getLatestBlockMessage() {
        return JSON.stringify({
            type: "latestBlock",
            payload: this.blockChain.chain.latestBlock(),
        });
    }
    getAllBlockMessage() {
        return JSON.stringify({
            type: "allBlock",
            payload: this.blockChain.chain.latestBlock(),
        });
    }
    getReceivedChainMessage() {
        return JSON.stringify({
            type: "receivedChain",
            payload: this.blockChain.chain.get(),
        });
    }
    getReceivedTransactionMessage(receivedTx) {
        return JSON.stringify({
            type: "receivedTransaction",
            payload: receivedTx,
        });
    }
}
exports.default = Message;
