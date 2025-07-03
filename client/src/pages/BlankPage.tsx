import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function BlankPage() {
  const navigate = useNavigate()
  const { isRTL } = useLanguage()

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md text-center bg-background/80 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
            <Construction className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Under Construction</CardTitle>
            <CardDescription>This page is currently being built</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            We're working hard to bring you this feature. Please check back soon!
          </p>
          <Button
            onClick={() => navigate("/")}
            className={cn("bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white", isRTL && "flex-row-reverse")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}