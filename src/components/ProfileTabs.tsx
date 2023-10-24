"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { useRouter } from "next/navigation";

const ProfileTabs = ({}) => {
  const router = useRouter();
  return (
    <div>
      <Tabs defaultValue="tab1" className="w-full ">
        <Tabs defaultValue="articles" className="w-full ">
          <div className="border-b border-gray-400 ">
            <TabsList className="grid w-[50%] grid-cols-4 ">
              <div onClick={() => router.push("/articles")}>
                <TabsTrigger value="articles">Articles</TabsTrigger>
              </div>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles">Articles</TabsContent>
          <TabsContent value="posts"></TabsContent>
          <TabsContent value="experience"></TabsContent>
          <TabsContent value="repositories"></TabsContent>
        </Tabs>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
