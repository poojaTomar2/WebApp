using iOtAds.Common;
using System;
using System.Net.Http;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;
using iOtAds.Business;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.System.Threading;

namespace iOtAds
{
    public sealed partial class MainPage : Page
    {
        private NavigationHelper navigationHelper;
        private ObservableDictionary defaultViewModel = new ObservableDictionary();
        private string urlHost = "http://localhost/iOtMobile";// TO DO for testing 
        private string videoFilePath = "/resources/videos/";// TO DO for testing 
        public ObservableDictionary DefaultViewModel
        {
            get { return this.defaultViewModel; }
        }
        public NavigationHelper NavigationHelper
        {
            get { return this.navigationHelper; }
        }


        DispatcherTimer dispatcherTimer;
        DateTimeOffset startTime;
        DateTimeOffset lastTime;
        DateTimeOffset stopTime;
        int timesTicked = 10;
        int timesToTick = 10;
        int currentlyPlayingID = 0;//TO DO
        public MainPage()
        {
            this.InitializeComponent();
            this.navigationHelper = new NavigationHelper(this);
            this.navigationHelper.LoadState += navigationHelper_LoadState;
            this.navigationHelper.SaveState += navigationHelper_SaveState;
            dispatcherTimer = new DispatcherTimer();
            dispatcherTimer.Tick += timer_Tick;
            dispatcherTimer.Interval = new TimeSpan(0, 0, 5);
            //IsEnabled defaults to false
            startTime = DateTimeOffset.Now;
            lastTime = startTime;
            dispatcherTimer.Start();
        }

        ////**** REFRESH PAGE ****////
        public void timer_Tick(object sender, object e)
        {
            DateTimeOffset time = DateTimeOffset.Now;
            TimeSpan span = time - lastTime;
            lastTime = time;
            //Time since last tick should be very very close to Interval
            timesTicked++;
            if (timesTicked > timesToTick)
            {
                currentlyPlayingID++;
                GetResponse();
            }
        }

        ////**** HIT URL ****////
        public async void GetResponse()
        {
            HttpClient client = new HttpClient();
            string jsonResponse = await client.GetStringAsync(urlHost + "/GetUpdate.ashx");//TO DO for testing

            RootObject rootObject = await JsonConvert.DeserializeObjectAsync<RootObject>(jsonResponse);
            List<string> mediaFiles = (rootObject.data).Split(',').ToList<string>();
            if (rootObject.success)
            {
                GetMediaElement(1, mediaFiles[currentlyPlayingID - 1]);
                if (currentlyPlayingID == 3)
                {
                    currentlyPlayingID = 0;
                }
            }
        }

        public void GetMediaElement(int contendId, string videoPath)
        {
            string htmlFragment = string.Format("<!DOCTYPE html><body><video width='100%' height='100%' controls><source src='{0}' type='video/mp4'></video></html>", urlHost + videoFilePath + videoPath);
            WebViewControl.NavigateToString(htmlFragment);
        }

        private void navigationHelper_LoadState(object sender, LoadStateEventArgs e)
        {
        }

        private void navigationHelper_SaveState(object sender, SaveStateEventArgs e)
        {
        }

        #region NavigationHelper registration

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            navigationHelper.OnNavigatedTo(e);
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            navigationHelper.OnNavigatedFrom(e);
        }

        #endregion

        private void Play_Click(object sender, RoutedEventArgs e)
        {
            //mediaSource.Play();
        }

        private void Pause_Click(object sender, RoutedEventArgs e)
        {
            //mediaSource.Pause();
        }

        private void Stop_Click(object sender, RoutedEventArgs e)
        {
            //mediaSource.Stop();
        }
    }
}
