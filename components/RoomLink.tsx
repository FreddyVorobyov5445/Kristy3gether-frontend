import { ActionIcon, CopyButton, TextInput, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

const RoomLink = ({ roomLink }: { roomLink: string }) => {
  const url = new URL(roomLink);
  url.searchParams.delete('username');
  const cleanRoomLink = url
    .toString()
    .replace('http://', '')
    .replace('https://', '');

  return (
    <div className="bg-white flex flex-col gap-4 items-start rounded-2xl p-4 w-full shadow-lg">
      <h2 className="font-bold text-xl">Room link</h2>
      <TextInput
        value={cleanRoomLink}
        className="w-full"
        readOnly
        rightSection={
          <CopyButton value={cleanRoomLink} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied!' : 'Copy'}
                withArrow
                position="top"
                classNames={{ tooltip: copied ? 'bg-green-500' : '' }}
              >
                <ActionIcon
                  color={copied ? 'green' : 'gray'}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
      />
    </div>
  );
};

export default RoomLink;
