class RoomDto {
    id;
    topic;
    roomType;
    createdAt;
    speakers;
    ownerId;


    constructor(room) {
        this.id = room._id;
        this.topic = room.topic;
        this.createdAt = room.createdAt;
        this.roomType = room.roomType;
        this.speakers = room.speakers;
        this.ownerId = room.ownerId;
    }
}

module.exports = RoomDto;