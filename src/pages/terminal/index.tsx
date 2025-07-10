// src/pages/terminal/index.tsx
import { useState, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  ArrowUp as ThumbUp,
  ArrowDown as ThumbDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SAMPLE_APPROVED_COMMAND,
  SAMPLE_DENIED_COMMAND,
  SOLICIT_INPUT_COMMANDS
} from '@/constants/terminal_commands';
import { ValidateReact } from '@/debug/DebugUtils';

type CommandStatus = 'pending' | 'approved' | 'denied';

interface CommandOutput {
  command: string;
  status: CommandStatus;
}

export default function TerminalPage() {
  const [terminalOpen] = useState(true); // Open by default
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<CommandOutput[]>([
    { command: SAMPLE_APPROVED_COMMAND, status: 'approved' },
    { command: SAMPLE_DENIED_COMMAND, status: 'denied' }
  ]); // Initial commands

  const handleCommand = () => {
    if (command.trim()) {
      setOutput([...output, { command: `$ ${command}`, status: 'pending' }]);
      setCommand('');
    }
  };

  const handleApprove = (index: number) => {
    const newOutput = [...output];
    if (newOutput[index]) {
      newOutput[index] = { ...newOutput[index], status: 'approved' };
      setOutput(newOutput);
    }
  };

  const handleDeny = (index: number) => {
    const newOutput = [...output];
    if (newOutput[index]) {
      newOutput[index] = { ...newOutput[index], status: 'denied' };
      setOutput(newOutput);
    }
  };
  // useEffect to focus on input when terminal opens
  useEffect(() => {
    if (terminalOpen) {
      const inputElement = document.getElementById('terminal-input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [terminalOpen]);

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <ValidateReact name="Terminal" />
      {terminalOpen && (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col bg-black p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <TerminalIcon className="mr-2 h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Terminal</h1>
            </div>
          </div>
          <div className="flex flex-grow flex-col">
            <div className="flex-grow overflow-y-auto rounded-md bg-gray-900 bg-opacity-70 p-4 font-mono text-sm">
              {output.map((item, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <p
                    className={
                      item.status === 'approved'
                        ? 'text-green-500'
                        : item.status === 'denied'
                          ? 'text-red-500'
                          : ''
                    }
                  >
                    {item.command}
                  </p>
                  {item.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs"
                        onClick={() => handleApprove(index)}
                      >
                        <ThumbUp className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs"
                        onClick={() => handleDeny(index)}
                      >
                        <ThumbDown className="mr-1 h-3 w-3" />
                        Deny
                      </Button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <ThumbUp
                      className="ml-2 h-4 w-4 text-green-500"
                      data-testid="approved-status-icon"
                    />
                  )}
                  {item.status === 'denied' && (
                    <ThumbDown
                      className="ml-2 h-4 w-4 text-red-500"
                      data-testid="denied-status-icon"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2">
              <div className="flex items-center">
                <span className="mr-2 text-green-500">$</span>
                <input
                  type="text"
                  id="terminal-input"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommand();
                    }
                  }}
                  className="w-full rounded-md bg-gray-800 bg-opacity-70 p-2 text-white focus:outline-none focus:ring-blue-500"
                  placeholder={SOLICIT_INPUT_COMMANDS}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
