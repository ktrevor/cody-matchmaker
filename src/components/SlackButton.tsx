import React, { useState, ReactNode } from "react";
import { createDMsAndSendMessages } from "../slack/sendToSlack";  // Import the sendToSlack function

// Define the type for children prop
type SlackButtonProps = {
  children: ReactNode;  
};

const SlackButton: React.FC<SlackButtonProps> = ({ children }) => {  // Explicitly accept children
  const [status, setStatus] = useState<string>("");

  const handleButtonClick = async (): Promise<void> => {
    const userGroups: string[][] = [
      ['U08A7LSRTK7', 'U089W09QZMM' ],    // Only Group for Now
    ];

    const message: string = "Hello! This is a test message sent to a group DM! 3/14"; 

    try {
      const results = await createDMsAndSendMessages(userGroups, message);
      setStatus(JSON.stringify(results, null, 2)); // Display the result (success or error for each group)
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>{children}</button>  {/* Pass children into button */}
      {status && <pre>{status}</pre>} {/* Display status/result */}
    </div>
  );
};

export default SlackButton;
