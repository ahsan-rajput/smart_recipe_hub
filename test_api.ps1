
$ErrorActionPreference = "Stop"

function Test-Api {
    try {
        # 1. Login
        Write-Host "Logging in..."
        $loginBody = @{
            email = "admin@example.com"
            password = "admin123"
        } | ConvertTo-Json

        $loginRes = Invoke-RestMethod -Uri "http://localhost:5000/api/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginRes.token
        Write-Host "Token received."

        $headers = @{
            Authorization = "Bearer $token"
        }

        # 2. Get Recipes to find an ID
        Write-Host "Fetching recipes..."
        $recipes = Invoke-RestMethod -Uri "http://localhost:5000/api/recipes" -Method Get
        if ($recipes.Count -eq 0) {
            Write-Error "No recipes found. Cannot proceed."
        }
        $recipeId = $recipes[0].id
        Write-Host "Using Recipe ID: $recipeId (" $recipes[0].title ")"

        # 3. Create Meal Plan
        $weekStart = [DateTime]::Today.ToString("yyyy-MM-dd") # Simple Local Date
        # Ensure it is a Monday for consistency with app logic (optional but good)
        # But server doesn't enforce Monday, just equality.

        Write-Host "Creating plan for week: $weekStart"
        
        $plan = @{
        "Monday"    = @{
            "lunch" = @(
                @{
                    "id" = $recipeId
                    "title" = "Test Recipe"
                    "userServings" = 8
                }
            )
        }
        "Tuesday"   = @{ "dinner" = @() }
        "Wednesday" = @{ "breakfast" = @() }
    }

        $planBody = @{
            plan_json = $plan
            weekStart = $weekStart
        } | ConvertTo-Json -Depth 10

        Write-Host "Sending Plan..."
        $saveRes = Invoke-RestMethod -Uri "http://localhost:5000/api/meal-plan" -Method Post -Body $planBody -Headers $headers -ContentType "application/json"
        Write-Host "Plan Saved: " $saveRes.message

        # 4. Get Shopping List
        Write-Host "Fetching Shopping List..."
        $listRes = Invoke-RestMethod -Uri "http://localhost:5000/api/shopping-list?weekStart=$weekStart" -Method Get -Headers $headers
        
        Write-Host "Shopping List Response:"
        $listRes | ConvertTo-Json -Depth 10
        
    } catch {
        Write-Error $_
        Write-Host "Response Body: " $_.ErrorDetails.Message
    }
}

Test-Api
