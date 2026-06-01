import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { streamChatResponse, isGeminiConfigured } from '@/lib/gemini';
import { chatService } from '@/services/chat.service';
import { conversationService } from '@/services/conversation.service';
import { sendMessageSchema } from '@/schemas/chat.schema';

// POST /api/chat - Send a message and stream response
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { success: false, error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validationResult = sendMessageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { conversationId, message } = validationResult.data;

    let currentConversationId = conversationId;

    // Create new conversation if no conversationId provided
    if (!currentConversationId) {
      const createResult = await chatService.createConversationWithMessage(
        userId,
        message
      );

      if (!createResult.success || !createResult.data) {
        return NextResponse.json(
          { success: false, error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      currentConversationId = createResult.data.conversationId;
    } else {
      // Verify ownership and add user message
      const isOwner = await conversationService.isOwner(
        currentConversationId,
        userId
      );

      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: 'Conversation not found' },
          { status: 404 }
        );
      }

      // Add user message
      const messageResult = await chatService.addUserMessage(
        currentConversationId,
        userId,
        message
      );

      if (!messageResult.success) {
        return NextResponse.json(
          { success: false, error: 'Failed to save message' },
          { status: 500 }
        );
      }
    }

    // Get conversation history for context
    const history = await chatService.getConversationHistory(
      currentConversationId
    );

    // Create a ReadableStream for SSE
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting chat stream for conversation:', currentConversationId);

          // Send conversation ID first
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'start',
                conversationId: currentConversationId,
              })}\n\n`
            )
          );

          // Stream the response from Gemini
          console.log('Calling Gemini API...');
          for await (const chunk of streamChatResponse(history, message)) {
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'delta', content: chunk })}\n\n`
              )
            );
          }
          console.log('Gemini response complete, total length:', fullResponse.length);

          // Save the complete assistant message
          const saveResult = await chatService.addAssistantMessage(
            currentConversationId!,
            fullResponse
          );

          // Send completion event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'done',
                messageId: saveResult.data?.id,
              })}\n\n`
            )
          );
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'An error occurred';

          // Send error event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: errorMessage,
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
