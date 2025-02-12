'use client';

import { Box, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ObjectChat() {
  const [input, setInput] = useState('');
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setIsLoading(true);

    await fetch('/api/completion', {
      method: 'POST',
      body: JSON.stringify({
        prompt: input,
      }),
    }).then(response => {
      response.json().then(result => {
        console.log("result: ", result);
        setGeneration(result);
        setIsLoading(false);
        setInput("");
        router.push(result);
      });
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  return (
    <div>
      {/* <div
        onClick={() => handleSubmit()}
      >
        Generate
      </div> */}

      <Flex direction="column" w="full" maxW="md" py={18} mx="auto">
        <Box 
          position="fixed"
          bottom={0}
           w="full"
           maxW="md"
        >
          {isLoading ? 'Loading...' : <pre>{generation}</pre>}
          <form onSubmit={handleSubmit}>
            <Input
              w="full"
              maxW="md"
              p={2}
              mb={8}
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="md"
              boxShadow="xl"
              value={input}
              placeholder="移動したいページは？"
              onChange={handleInputChange}
              bg="white"
              _dark={{
                bg: "gray.900",
                borderColor: "gray.800",
              }}
            />
          </form>
        </Box>
      </Flex>
    </div>
  );
}