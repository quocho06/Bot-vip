module.exports.config = {
	name: "setprefix",
	version: "2.0.0",
	hasPermssion: 1,
	credits: "Vtuan",
	description: "Đặt lại prefix của nhóm",
	commandCategory: "Quản Trị Viên",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		var data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = handleReaction.PREFIX;
		await Threads.setData(threadID, { data });
		await global.data.threadData.set(String(threadID), data);
		api.unsendMessage(handleReaction.messageID);

		api.changeNickname(`[ ${handleReaction.PREFIX} ] • ${global.config.BOTNAME}`, event.threadID, event.senderID);

		return api.sendMessage({body: `✅ Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`}, event.threadID, event.messageID);
	} catch (e) { 
		return console.log(e);
	}
};

module.exports.run = async ({ api, event, args, Threads }) => {
	if (typeof args[0] == "undefined") return api.sendMessage({body: "❎ Phần prefix cần đặt không được để trống"}, event.threadID, event.messageID);

	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage({body: "❎ Phần prefix cần đặt không được để trống"}, event.threadID, event.messageID);

	if (prefix == "reset") {
		var data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);
		api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`, event.threadID, event.senderID);
		return api.sendMessage({body: `✅ Đã reset prefix về mặc định: ${global.config.PREFIX}`}, event.threadID, event.messageID);
	} else {
		return api.sendMessage({body: `Bạn muốn đổi prefix thành: ${prefix}\nThả cảm xúc để xác nhận`}, event.threadID, (error, info) => {
			if (error) return console.log(error);
			global.client.handleReaction.push({
				name: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				PREFIX: prefix
			});
		});
	}
};
