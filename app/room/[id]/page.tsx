'use client';
import { isRoomExists } from '@/api/rooms';
import {
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
} from '@/api/socket';
import { Room, RoomErrors, User } from '@/app/types';
import Chat from '@/components/Chat';
import RoomLink from '@/components/RoomLink';
import RoomNotFound from '@/components/RoomNotFound';
import UsernameErrorComponent from '@/components/UsernameErrorComponent';
import Users from '@/components/Users';
import VideoPlayer from '@/components/VideoPlayer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export default function Room({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const [username, setUsername] = useState<string | null>(
    searchParams.get('username')
  );
  const [room, setRoom] = useState<Room>();
  const [roomError, setRoomError] = useState<RoomErrors | null>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const checkRoomExists = async () => {
      const roomExists = await isRoomExists(params.id);
      if (!roomExists) {
        setRoomError(RoomErrors.ROOM_NOT_FOUND);
      }
    };

    checkRoomExists();
  }, [params.id]);

  useEffect(() => {
    if (!username) {
      setRoomError(RoomErrors.USERNAME_EMPTY);
      return;
    } else {
      setRoomError(null);
    }

    const socketInstance = initSocket({
      id: params.id,
      username: username as string,
    });

    setSocket(socketInstance);
    setRoomError(null);

    socketInstance.on('username-taken', () => {
      setRoomError(RoomErrors.USERNAME_TAKEN);
    });

    socketInstance.on('room-data', (data: Room) =>
      onRoomDataEvent({ setRoom, data })
    );

    socketInstance.on('user-joined', (data: User) => {
      onUserJoinedEvent({ setRoom, data });
    });

    socketInstance.on('user-left', (data: User) => {
      onUserLeftEvent({ setRoom, data });
    });

    return () => {
      socketInstance.off('room-data');
      socketInstance.off('user-joined');
      socketInstance.off('user-left');
      socketInstance.disconnect();
    };
  }, [params.id, username]);

  return (
    <div className="h-full w-full">
      {room && !roomError && username && (
        <div className="h-full w-full flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 items-center w-full md:w-2/3 h-full">
            <VideoPlayer room={room} socket={socket} />

            <div className="flex flex-col gap-4 w-full">
              <Users room={room} />
              <RoomLink roomLink={window.location.href} />
            </div>
          </div>
          <Chat />
        </div>
      )}
      {roomError &&
        (roomError === RoomErrors.USERNAME_EMPTY ||
          roomError === RoomErrors.USERNAME_TAKEN) && (
          <UsernameErrorComponent
            roomId={params.id}
            setUsername={setUsername}
            roomError={roomError}
          />
        )}
      {roomError === RoomErrors.ROOM_NOT_FOUND && <RoomNotFound />}
    </div>
  );
}
