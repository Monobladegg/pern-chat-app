import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {message} = req.body
    const {id: receiverId} = req.params
    const senderId = req.user.id

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, receiverId]
        }
      }
    })

    // the very first message sent to a user will create the conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantsIds: {set: [senderId, receiverId]}
        }
      })
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id
      }
    })

    if (newMessage) {
      conversation = await prisma.conversation.update({ 
        where: {
          id: conversation.id
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id
            }
          }
        }
      })
    }

    res.status(201).json({message: "Message sent", newMessage: newMessage})
  } catch (error: any) {
    console.error("error in sendMessage", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const {id: userToChatId} = req.params
    const senderId = req.user.id

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, userToChatId]
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    })
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }
    
    // res.status(200).json(conversation.messages.map((message) => message.body))

    res.status(200).json(conversation.messages)

  } catch (error: any) {
    console.error("error in getMessages", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId
        }
      },
      select: {
        id: true,
        username: true,
        profilePic: true
      }
    })

    res.status(200).json(users)
  } catch (error: any) {
    console.error("error in getUsersForSidebar", error)
    res.status(500).json({ error: "Internal server error" })
  }
}