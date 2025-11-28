import os
from pathlib import Path
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import CodeInterpreterTool
import json

# Create an AIProjectClient from an endpoint, copied from your Azure AI Foundry project.
# You need to login to Azure subscription via Azure CLI and set the environment variables
subscription_id = ""
resource_group_name = ""
project_name = ""  # Extracted from your URL
# agent_id = ""

def run_non_deterministic(agent_id, message_text="Hello from Python!"):
    """Test communication with an existing Azure AI Foundry agent"""
    
    print("🔧 Configuration:")
    print(f"   Subscription ID: {subscription_id}")
    print(f"   Resource Group: {resource_group_name}")
    print(f"   Project Name: {project_name}")
    print(f"   Agent ID: {agent_id}")
    print(f"   Authentication: DefaultAzureCredential (az login)")
    print("=" * 60)
    
    try:
        # Create an AIProjectClient instance
        print("🔐 Authenticating with Azure AI Foundry...")
        # Correct endpoint format: https://<ai-services-account>.services.ai.azure.com/api/projects/<project-name>
        endpoint = f"https://aaf-aiproj-sitizapp-i01.services.ai.azure.com/api/projects/{project_name}"
        print(f"🌐 Using endpoint: {endpoint}")
        
        project_client = AIProjectClient(
            endpoint=endpoint,
            credential=DefaultAzureCredential(),  # Uses az login credentials
        )
        print("✅ Successfully created AI Project Client")
        
        with project_client:
            # First, let's try to list available agents to verify our agent exists
            print("\n🔍 Listing available agents...")
            agent_found = False
            try:
                agents = project_client.agents.list_agents()
                print("✅ Available agents:")
                for agent in agents:
                    print(f"   - ID: {agent.id}, Name: {getattr(agent, 'name', 'N/A')}")
                    if agent.id == agent_id:
                        print(f"     ✅ Found target agent: {getattr(agent, 'name', 'N/A')}")
                        agent_found = True
                
                if not agent_found:
                    print(f"❌ Agent with ID '{agent_id}' not found!")
                    print("Available agent IDs:")
                    for agent in agents:
                        print(f"   - {agent.id}")
                    return
                    
            except Exception as e:
                print(f"❌ Error listing agents: {e}")
                print("Continuing with the provided agent ID...")
                agent_found = True  # Continue even if listing fails
            
            # Create a thread for communication
            print(f"\n📝 Creating a new thread...")
            thread = project_client.agents.threads.create()
            print(f"✅ Created thread with ID: {thread.id}")
            
            # Add a message to the thread
            print(f"\n💬 Adding message to thread...")
            message = project_client.agents.messages.create(
                thread_id=thread.id,
                role="user",
                content=message_text,
            )
            print(f"✅ Created message with ID: {message.id}")
            print(f"📤 Message content: {message_text}")
            
            # Create and process an agent run
            print(f"\n🚀 Creating and processing agent run...")
            run = project_client.agents.runs.create_and_process(
                thread_id=thread.id,
                agent_id=agent_id,
                additional_instructions="Please provide a helpful and detailed response.",
            )
            print(f"✅ Run completed with status: {run.status}")
            
            # Check if the run failed
            if run.status == "failed":
                print(f"❌ Run failed: {getattr(run, 'last_error', 'Unknown error')}")
                return
            elif run.status == "completed":
                print("✅ Agent run completed successfully!")
            
            # Fetch and display all messages in the thread
            print(f"\n📥 Fetching messages from thread...")
            messages = list(project_client.agents.messages.list(thread_id=thread.id))
            assistant_messages = [msg for msg in messages if msg.role == "assistant"]

            if not assistant_messages:
                return None  # no assistant messages found

            last_assistant = assistant_messages[-1]

            # Extract text from the message content
            text_value = None
            if hasattr(last_assistant, "content") and last_assistant.content:
                if isinstance(last_assistant.content, list):
                    for content_item in last_assistant.content:
                        if hasattr(content_item, "text") and content_item.text:
                            text_value = content_item.text.value.strip()
                            break
                elif isinstance(last_assistant.content, str):
                    text_value = last_assistant.content.strip()

            if not text_value:
                return None

            # Try parsing as JSON, else return raw text
            try:
                return json.loads(text_value)
            except json.JSONDecodeError:
                return text_value
            
            print("✅ Agent communication test completed successfully!")
            
            
    except Exception as e:
        print(f"❌ Error during agent communication: {e}")
        print(f"Error type: {type(e).__name__}")
        
        # Provide troubleshooting suggestions
        print("\n🔧 Troubleshooting suggestions:")
        print("1. Verify you're logged in with 'az login'")
        print("2. Check that your project endpoint is correct")
        print("3. Ensure you have the 'Azure AI User' role on the project")
        print("4. Verify the agent ID exists in your project")
        print("5. Make sure you're using a Foundry project (not hub-based)")


def get_azure_details_from_cli():
    """Get Azure subscription and resource details from Azure CLI"""
    import subprocess
    
    try:
        # Get subscription ID
        result = subprocess.run(
            ["az", "account", "show", "--query", "id", "-o", "tsv"],
            capture_output=True,
            text=True,
            check=True,
        )
        subscription_id = result.stdout.strip()
        
        # Get default resource group (if available)
        # We'll need the user to provide this or we can try to find it
        print(f"✅ Found subscription ID: {subscription_id}")
        return subscription_id
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error getting Azure details: {e}")
        return None
